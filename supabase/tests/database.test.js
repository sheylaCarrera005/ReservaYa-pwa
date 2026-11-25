import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const database = new PGlite();
const customerA = '00000000-0000-4000-8000-00000000000a';
const customerB = '00000000-0000-4000-8000-00000000000b';
const hotelItem = '30000000-0000-4000-8000-000000000001';
const restaurantItem = '30000000-0000-4000-8000-000000000004';

async function authenticate(userId) {
  await database.exec('reset role; reset request.jwt.claim.sub; set role authenticated');
  await database.query("select set_config('request.jwt.claim.sub', $1, false)", [userId]);
}

async function asAdministrator() {
  await database.exec('reset role; reset request.jwt.claim.sub');
}

before(async () => {
  await database.exec(`
    create schema auth;
    create role anon nologin;
    create role authenticated nologin;
    grant usage on schema public to anon, authenticated;
    create table auth.users (
      id uuid primary key,
      raw_user_meta_data jsonb not null default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
  `);
  await database.exec(await readFile(new URL('../migrations/20261125194910_initial_reservaya_schema.sql', import.meta.url), 'utf8'));
  await database.exec(await readFile(new URL('../migrations/20261125200641_backfill_reservaya_profiles.sql', import.meta.url), 'utf8'));
  await database.exec(await readFile(new URL('../seed.sql', import.meta.url), 'utf8'));
});

after(() => database.close());

test('la migración y el seed crean el catálogo completo', async () => {
  const establishments = await database.query('select count(*)::int as count from public.establishments');
  const items = await database.query('select count(*)::int as count from public.bookable_items');
  const schedules = await database.query('select count(*)::int as count from public.availability_rules');
  const protectedTables = await database.query(`
    select count(*)::int as count from pg_class
    where relnamespace = 'public'::regnamespace and relkind = 'r' and not relrowsecurity
  `);

  assert.equal(establishments.rows[0].count, 8);
  assert.equal(items.rows[0].count, 8);
  assert.equal(schedules.rows[0].count, 56);
  assert.equal(protectedTables.rows[0].count, 0);
});

test('el registro en Auth crea un perfil seguro', async () => {
  await database.query(
    'insert into auth.users (id, raw_user_meta_data) values ($1, $2), ($3, $4)',
    [customerA, JSON.stringify({ full_name: 'Cliente Uno' }), customerB, JSON.stringify({})],
  );
  const result = await database.query('select full_name from public.profiles order by full_name');

  assert.deepEqual(result.rows.map((row) => row.full_name), ['Cliente Uno', 'Usuario de ReservaYa']);
  await authenticate(customerA);
  const hiddenProfile = await database.query(
    "update public.profiles set full_name = 'Otro' where id = $1 returning id",
    [customerB],
  );
  assert.equal(hiddenProfile.rows.length, 0);
  await asAdministrator();
});

test('el precio de hotel se calcula en el servidor por noches', async () => {
  await authenticate(customerA);
  const result = await database.query(`
    insert into public.reservations (
      customer_id, bookable_item_id, starts_at, ends_at, party_size, unit_price, total_price
    ) values ($1, $2, '2027-03-01T15:00:00Z', '2027-03-03T12:00:00Z', 2, 1, 1)
    returning booking_code, status, unit_price, total_price, currency
  `, [customerA, hotelItem]);

  assert.equal(result.rows[0].status, 'pending');
  assert.equal(result.rows[0].unit_price, '280.00');
  assert.equal(result.rows[0].total_price, '560.00');
  assert.equal(result.rows[0].currency, 'USD');
  assert.match(result.rows[0].booking_code, /^RY-[A-F0-9]{12}$/);
});

test('no acepta fechas pasadas ni grupos que superen la capacidad', async () => {
  await authenticate(customerA);
  await assert.rejects(
    database.query(`
      insert into public.reservations (customer_id, bookable_item_id, starts_at, party_size)
      values ($1, $2, now() - interval '1 day', 2)
    `, [customerA, hotelItem]),
    /fecha futura/,
  );
  await assert.rejects(
    database.query(`
      insert into public.reservations (customer_id, bookable_item_id, starts_at, party_size)
      values ($1, $2, '2027-03-05T20:00:00Z', 99)
    `, [customerA, restaurantItem]),
    /supera la capacidad/,
  );
  await asAdministrator();
});

test('un restaurante calcula su hora de fin desde la duración', async () => {
  const result = await database.query(`
    insert into public.reservations (customer_id, bookable_item_id, starts_at, party_size)
    values ($1, $2, '2027-03-05T20:00:00Z', 3)
    returning starts_at, ends_at, total_price
  `, [customerA, restaurantItem]);

  assert.equal(Date.parse(result.rows[0].ends_at) - Date.parse(result.rows[0].starts_at), 120 * 60 * 1000);
  assert.equal(result.rows[0].total_price, '0.00');
});

test('RLS permite el catálogo público y aísla las reservas por cliente', async () => {
  await database.exec('set role anon');
  const catalog = await database.query('select count(*)::int as count from public.establishments');
  await assert.rejects(
    database.query('select count(*)::int as count from public.reservations'),
    /permission denied/,
  );
  assert.equal(catalog.rows[0].count, 8);

  await authenticate(customerA);
  const ownRows = await database.query('select count(*)::int as count from public.reservations');
  assert.equal(ownRows.rows[0].count, 2);
  const ownReservation = await database.query('select id from public.reservations limit 1');
  await database.query(
    "update public.reservations set status = 'cancelled', cancellation_reason = 'Cambio de planes' where id = $1",
    [ownReservation.rows[0].id],
  );
  await assert.rejects(
    database.query(`
      insert into public.reservations (customer_id, bookable_item_id, starts_at, party_size)
      values ($1, $2, '2027-04-01T15:00:00Z', 2)
    `, [customerB, hotelItem]),
    /row-level security/,
  );
  await assert.rejects(
    database.query("update public.establishments set name = 'No autorizado'"),
    /permission denied/,
  );

  await authenticate(customerB);
  const otherRows = await database.query('select count(*)::int as count from public.reservations');
  assert.equal(otherRows.rows[0].count, 0);
  await asAdministrator();
});

test('solo se puede reseñar una reserva completada propia y se actualiza el promedio', async () => {
  await asAdministrator();
  const inserted = await database.query(`
    insert into public.reservations (customer_id, bookable_item_id, starts_at, party_size)
    values ($1, $2, '2027-04-10T20:00:00Z', 2)
    returning id
  `, [customerA, restaurantItem]);
  await database.query('update public.reservations set status = $1 where id = $2', ['completed', inserted.rows[0].id]);

  await authenticate(customerB);
  await assert.rejects(
    database.query(`
      insert into public.reviews (reservation_id, customer_id, bookable_item_id, rating)
      values ($1, $2, $3, 5)
    `, [inserted.rows[0].id, customerB, restaurantItem]),
    /row-level security/,
  );

  await authenticate(customerA);
  await database.query(`
    insert into public.reviews (reservation_id, customer_id, bookable_item_id, rating, comment)
    values ($1, $2, $3, 5, 'Excelente servicio')
  `, [inserted.rows[0].id, customerA, restaurantItem]);
  await asAdministrator();
  const rating = await database.query(`
    select rating_average, review_count from public.establishments
    where id = '20000000-0000-4000-8000-000000000004'
  `);
  assert.equal(rating.rows[0].rating_average, '5.0');
  assert.equal(rating.rows[0].review_count, 1);
});

test('el lote demo ampliado es repetible y no duplica datos', async () => {
  const demoDatabase = new PGlite();
  await demoDatabase.exec(`
    create schema auth;
    create role anon nologin;
    create role authenticated nologin;
    grant usage on schema public to anon, authenticated;
    create table auth.users (
      id uuid primary key,
      raw_user_meta_data jsonb not null default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select null::uuid
    $$;
  `);
  await demoDatabase.exec(await readFile(new URL('../migrations/20261125194910_initial_reservaya_schema.sql', import.meta.url), 'utf8'));
  await demoDatabase.exec(await readFile(new URL('../seed.sql', import.meta.url), 'utf8'));
  await demoDatabase.query('insert into auth.users (id) values ($1)', [customerA]);
  await demoDatabase.exec(await readFile(new URL('../seeds/demo_visualization.sql', import.meta.url), 'utf8'));
  await demoDatabase.exec(await readFile(new URL('../seeds/demo_visualization.sql', import.meta.url), 'utf8'));
  const counts = await demoDatabase.query(`
    select
      (select count(*)::int from public.establishments) as establishments,
      (select count(*)::int from public.bookable_items) as items,
      (select count(*)::int from public.availability_rules) as schedules,
      (select count(*)::int from public.reservations) as reservations,
      (select count(*)::int from public.reviews) as reviews,
      (select count(*)::int from public.favorites) as favorites
  `);
  assert.deepEqual(counts.rows[0], {
    establishments: 11,
    items: 11,
    schedules: 77,
    reservations: 5,
    reviews: 3,
    favorites: 3,
  });
  await demoDatabase.close();
});
