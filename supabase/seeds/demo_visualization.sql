-- Datos ficticios para pruebas y visualización de ReservaYa.
-- Ejecutar después de las migraciones y de supabase/seed.sql.
-- Requiere al menos un perfil existente; no crea usuarios ni credenciales.
-- El archivo puede ejecutarse varias veces sin duplicar registros.

insert into public.establishments (
  id, category, slug, name, description, location, city, country_code,
  image_url, tags, rating_average, review_count
)
values
  ('21000000-0000-4000-8000-000000000001', 'hotels', 'hotel-casa-del-lago',
   'Hotel Casa del Lago', 'Hotel de ambiente tranquilo con jardín, desayuno y vistas al agua.',
   'Zona del Lago', 'Valle de Bravo', 'MX',
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
   '{Desayuno,Vista al lago}', 4.6, 0),
  ('21000000-0000-4000-8000-000000000002', 'restaurants', 'cocina-del-mercado',
   'Cocina del Mercado', 'Cocina mexicana contemporánea con ingredientes de productores locales.',
   'Barrio del Mercado', 'Ciudad de México', 'MX',
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
   '{Mexicana,Local}', 4.5, 0),
  ('21000000-0000-4000-8000-000000000003', 'experiences', 'paseo-en-kayak-al-amanecer',
   'Paseo en Kayak al Amanecer', 'Recorrido guiado para principiantes con equipo incluido.',
   'Embarcadero Norte', 'Valle de Bravo', 'MX',
   'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?auto=format&fit=crop&w=1200&q=80',
   '{Aire libre,Guiado}', 4.8, 0)
on conflict (id) do nothing;

insert into public.bookable_items (
  id, establishment_id, name, description, capacity, duration_minutes,
  unit_price, currency, pricing_unit, check_in_time, check_out_time
)
values
  ('31000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
   'Habitación con vista al lago', 'Habitación doble con balcón y desayuno incluido.',
   2, 1440, 175.00, 'USD', 'night', '15:00', '12:00'),
  ('31000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002',
   'Mesa en el comedor', 'Reserva de mesa para dos personas sin comisión.',
   2, 90, 0.00, 'USD', 'booking', null, null),
  ('31000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000003',
   'Kayak doble con guía', 'Sesión de dos horas con chaleco, remo e instructivo.',
   2, 120, 45.00, 'USD', 'person', null, null)
on conflict (id) do nothing;

insert into public.availability_rules (
  bookable_item_id, day_of_week, start_time, end_time
)
select
  b.id,
  days.day_of_week,
  case e.category when 'restaurants' then '12:00'::time else '07:00'::time end,
  case e.category when 'restaurants' then '22:00'::time else '18:00'::time end
from public.bookable_items b
join public.establishments e on e.id = b.establishment_id
cross join generate_series(0, 6) as days(day_of_week)
where b.id between '31000000-0000-4000-8000-000000000001' and '31000000-0000-4000-8000-000000000003'
on conflict do nothing;

-- El historial necesita fechas pasadas: solo este seed administrativo desactiva
-- temporalmente la validación de nuevas reservas y la restaura al terminar.
-- Los roles anon/authenticated no pueden alterar tablas ni ejecutar este cambio.
drop trigger reservations_prepare on public.reservations;

insert into public.reservations (
  id, customer_id, bookable_item_id, starts_at, ends_at, party_size, status,
  booking_code, unit_price, total_price, currency, special_requests, created_at
)
select
  d.id::uuid,
  c.id,
  d.item_id::uuid,
  (date_trunc('day', now()) + make_interval(days => d.day_offset, hours => 1)) at time zone 'UTC',
  (date_trunc('day', now()) + make_interval(days => d.day_offset, hours => 1) + make_interval(mins => d.minutes)) at time zone 'UTC',
  d.party_size,
  d.status::public.reservation_status,
  d.booking_code,
  b.unit_price,
  case b.pricing_unit
    when 'night' then round(b.unit_price * greatest(1, ceil(d.minutes / 1440.0)), 2)
    when 'person' then round(b.unit_price * d.party_size, 2)
    else b.unit_price
  end,
  b.currency,
  'Dato de demostración: no representa una reserva real.',
  now() - interval '2 days'
from (values
  ('41000001-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', -10, 120, 2, 'completed', 'RY-DEMO-000001'),
  ('41000002-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000007', -6, 90, 2, 'completed', 'RY-DEMO-000002'),
  ('41000003-0000-4000-8000-000000000003', '31000000-0000-4000-8000-000000000003', -3, 120, 2, 'completed', 'RY-DEMO-000003'),
  ('41000004-0000-4000-8000-000000000004', '31000000-0000-4000-8000-000000000001', 7, 2880, 2, 'confirmed', 'RY-DEMO-000004'),
  ('41000005-0000-4000-8000-000000000005', '31000000-0000-4000-8000-000000000002', 14, 90, 2, 'pending', 'RY-DEMO-000005')
) as d(id, item_id, day_offset, minutes, party_size, status, booking_code)
cross join lateral (
  select id from public.profiles order by created_at, id limit 1
) c
join public.bookable_items b on b.id = d.item_id::uuid
where not exists (select 1 from public.reservations)
on conflict (id) do nothing;

create trigger reservations_prepare
before insert or update of bookable_item_id, starts_at, ends_at, party_size, status
on public.reservations
for each row execute function public.prepare_reservation();

insert into public.reviews (
  id, reservation_id, customer_id, bookable_item_id, rating, comment
)
select
  ('51000000-0000-4000-8000-00000000000' || sample_number)::uuid,
  r.id,
  r.customer_id,
  r.bookable_item_id,
  sample.rating,
  sample.comment
from public.reservations r
join (values
  ('41000001-0000-4000-8000-000000000001'::uuid, 1, 5, 'Muy buena atención y ambiente agradable. Dato de demostración.'),
  ('41000002-0000-4000-8000-000000000002'::uuid, 2, 4, 'Una experiencia relajante y bien organizada. Dato de demostración.'),
  ('41000003-0000-4000-8000-000000000003'::uuid, 3, 5, 'El recorrido fue divertido y el guía muy atento. Dato de demostración.')
) as sample(reservation_id, sample_number, rating, comment) on sample.reservation_id = r.id
on conflict (reservation_id) do nothing;

insert into public.favorites (customer_id, establishment_id)
select r.customer_id, e.id
from public.reservations r
join public.bookable_items b on b.id = r.bookable_item_id
join public.establishments e on e.id = b.establishment_id
where r.id in (
  '41000001-0000-4000-8000-000000000001',
  '41000003-0000-4000-8000-000000000003',
  '41000004-0000-4000-8000-000000000004'
)
on conflict do nothing;
