-- ReservaYa: catálogo, reservas, reseñas y perfiles de clientes.
-- Las contraseñas y sesiones las administra Supabase Auth (auth.users).

create type public.establishment_category as enum (
  'hotels',
  'restaurants',
  'experiences'
);

create type public.reservation_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed'
);

create type public.pricing_unit as enum (
  'night',
  'person',
  'booking'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 80),
  phone text check (phone is null or char_length(phone) <= 30),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.establishments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  category public.establishment_category not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  location text not null,
  address text,
  city text,
  country_code char(2),
  timezone text not null default 'America/Mexico_City',
  phone text,
  email text,
  image_url text,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  rating_average numeric(2,1) not null default 0 check (rating_average between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cada fila representa una habitación, mesa u oferta de experiencia reservable.
-- El inventario físico y el control de concurrencia se añadirán con el motor de disponibilidad.
create table public.bookable_items (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  capacity integer not null check (capacity > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  currency char(3) not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  pricing_unit public.pricing_unit not null,
  check_in_time time,
  check_out_time time,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  bookable_item_id uuid not null references public.bookable_items (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = domingo
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  unique (bookable_item_id, day_of_week, start_time, end_time),
  check (start_time < end_time)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  customer_id uuid not null references public.profiles (id) on delete restrict,
  bookable_item_id uuid not null references public.bookable_items (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  party_size integer not null check (party_size > 0),
  status public.reservation_status not null default 'pending',
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  special_requests text check (special_requests is null or char_length(special_requests) <= 1000),
  cancellation_reason text check (cancellation_reason is null or char_length(cancellation_reason) <= 500),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, customer_id),
  check (ends_at > starts_at),
  check (
    (status = 'cancelled' and cancelled_at is not null)
    or (status <> 'cancelled' and cancelled_at is null)
  )
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  bookable_item_id uuid not null references public.bookable_items (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 2000),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (reservation_id, customer_id)
    references public.reservations (id, customer_id) on delete cascade
);

create table public.favorites (
  customer_id uuid not null references public.profiles (id) on delete cascade,
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, establishment_id)
);

create index establishments_category_active_idx
  on public.establishments (category, is_active);
create index establishments_location_idx
  on public.establishments (city, location);
create index bookable_items_establishment_active_idx
  on public.bookable_items (establishment_id, is_active);
create index availability_rules_item_day_idx
  on public.availability_rules (bookable_item_id, day_of_week);
create index reservations_customer_created_idx
  on public.reservations (customer_id, created_at desc);
create index reservations_item_period_idx
  on public.reservations (bookable_item_id, starts_at, ends_at)
  where status in ('pending', 'confirmed');
create index reviews_item_published_idx
  on public.reviews (bookable_item_id, is_published);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger establishments_touch_updated_at
before update on public.establishments
for each row execute function public.touch_updated_at();
create trigger bookable_items_touch_updated_at
before update on public.bookable_items
for each row execute function public.touch_updated_at();
create trigger reviews_touch_updated_at
before update on public.reviews
for each row execute function public.touch_updated_at();

-- Auth es la fuente de identidad; el perfil solo contiene datos editables del cliente.
create or replace function public.handle_new_reservaya_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(left(btrim(new.raw_user_meta_data ->> 'full_name'), 80), ''),
      nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 80), ''),
      'Usuario de ReservaYa'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_reservaya_user() from public, anon, authenticated;

create trigger on_auth_user_created_reservaya
after insert on auth.users
for each row execute function public.handle_new_reservaya_user();

-- Copia el precio del catálogo: el cliente nunca decide el importe de una reserva.
create or replace function public.prepare_reservation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  item record;
  units numeric;
begin
  select
    b.establishment_id,
    b.capacity,
    b.duration_minutes,
    b.unit_price,
    b.currency,
    b.pricing_unit,
    b.is_active,
    e.is_active as establishment_is_active
  into item
  from public.bookable_items b
  join public.establishments e on e.id = b.establishment_id
  where b.id = new.bookable_item_id;

  if not found or not item.is_active or not item.establishment_is_active then
    raise exception 'El elemento seleccionado no está disponible';
  end if;

  if new.starts_at <= now() then
    raise exception 'La reserva debe comenzar en una fecha futura';
  end if;

  if new.party_size > item.capacity then
    raise exception 'La cantidad de personas supera la capacidad disponible';
  end if;

  if item.pricing_unit = 'night' then
    new.ends_at = coalesce(
      new.ends_at,
      new.starts_at + make_interval(days => 1)
    );
  else
    new.ends_at = new.starts_at + make_interval(mins => item.duration_minutes);
  end if;

  if new.ends_at <= new.starts_at then
    raise exception 'La fecha de salida debe ser posterior a la fecha de entrada';
  end if;

  if tg_op = 'INSERT' then
    new.booking_code = 'RY-' || upper(substr(replace(new.id::text, '-', ''), 1, 12));
    new.status = 'pending';
    new.cancelled_at = null;
  end if;

  new.unit_price = item.unit_price;
  new.currency = item.currency;

  if item.pricing_unit = 'night' then
    units = ceil(extract(epoch from (new.ends_at - new.starts_at)) / 86400);
    new.total_price = round(item.unit_price * units, 2);
  elsif item.pricing_unit = 'person' then
    new.total_price = round(item.unit_price * new.party_size, 2);
  else
    new.total_price = item.unit_price;
  end if;

  if new.status = 'cancelled' then
    new.cancelled_at = coalesce(new.cancelled_at, now());
  else
    new.cancelled_at = null;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

create trigger reservations_prepare
before insert or update of bookable_item_id, starts_at, ends_at, party_size, status
on public.reservations
for each row execute function public.prepare_reservation();

-- Mantiene los contadores del catálogo sin exponer escritura sobre establecimientos.
create or replace function public.refresh_establishment_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_establishment_id uuid;
begin
  select establishment_id into target_establishment_id
  from public.bookable_items
  where id = coalesce(new.bookable_item_id, old.bookable_item_id);

  update public.establishments e
  set
    rating_average = coalesce(stats.average, 0),
    review_count = coalesce(stats.total, 0),
    updated_at = now()
  from (
    select round(avg(r.rating)::numeric, 1) as average, count(*) as total
    from public.reviews r
    join public.bookable_items b on b.id = r.bookable_item_id
    where b.establishment_id = target_establishment_id and r.is_published
  ) stats
  where e.id = target_establishment_id;

  return coalesce(new, old);
end;
$$;

revoke all on function public.refresh_establishment_rating() from public, anon, authenticated;

create trigger reviews_refresh_establishment_rating
after insert or update or delete on public.reviews
for each row execute function public.refresh_establishment_rating();

alter table public.profiles enable row level security;
alter table public.establishments enable row level security;
alter table public.bookable_items enable row level security;
alter table public.availability_rules enable row level security;
alter table public.reservations enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

create policy "Perfil propio visible"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "Perfil propio recuperable"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);
create policy "Perfil propio editable"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Establecimientos activos visibles"
on public.establishments for select to anon, authenticated
using (is_active);
create policy "Elementos activos visibles"
on public.bookable_items for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.establishments e
    where e.id = establishment_id and e.is_active
  )
);
create policy "Horarios de elementos activos visibles"
on public.availability_rules for select to anon, authenticated
using (
  exists (
    select 1 from public.bookable_items b
    where b.id = bookable_item_id and b.is_active
  )
);

create policy "Reservas propias visibles"
on public.reservations for select to authenticated
using ((select auth.uid()) = customer_id);
create policy "Reservas propias pendientes"
on public.reservations for insert to authenticated
with check ((select auth.uid()) = customer_id and status = 'pending');
create policy "Reservas propias cancelables"
on public.reservations for update to authenticated
using (
  (select auth.uid()) = customer_id
  and status in ('pending', 'confirmed')
  and starts_at > now()
)
with check ((select auth.uid()) = customer_id and status = 'cancelled');

create policy "Reseñas públicas visibles"
on public.reviews for select to anon, authenticated
using (is_published or (select auth.uid()) = customer_id);
create policy "Reseña de reserva completada propia"
on public.reviews for insert to authenticated
with check (
  (select auth.uid()) = customer_id
  and exists (
    select 1 from public.reservations r
    where r.id = reservation_id
      and r.bookable_item_id = reviews.bookable_item_id
      and r.customer_id = (select auth.uid())
      and r.status = 'completed'
  )
);
create policy "Reseña propia editable"
on public.reviews for update to authenticated
using ((select auth.uid()) = customer_id)
with check ((select auth.uid()) = customer_id);
create policy "Reseña propia eliminable"
on public.reviews for delete to authenticated
using ((select auth.uid()) = customer_id);

create policy "Favoritos propios visibles"
on public.favorites for select to authenticated
using ((select auth.uid()) = customer_id);
create policy "Favoritos propios agregables"
on public.favorites for insert to authenticated
with check ((select auth.uid()) = customer_id);
create policy "Favoritos propios eliminables"
on public.favorites for delete to authenticated
using ((select auth.uid()) = customer_id);

-- Permisos explícitos para la Data API, además de las políticas RLS.
revoke all on public.profiles, public.establishments, public.bookable_items,
  public.availability_rules, public.reservations, public.reviews, public.favorites
from anon, authenticated;

grant select on public.establishments, public.bookable_items,
  public.availability_rules, public.reviews to anon;
grant select on public.profiles, public.establishments, public.bookable_items,
  public.availability_rules, public.reservations, public.reviews, public.favorites
  to authenticated;
grant insert, update (full_name, phone, avatar_url) on public.profiles to authenticated;
grant insert on public.reservations to authenticated;
grant update (status, cancellation_reason) on public.reservations to authenticated;
grant insert, delete on public.favorites to authenticated;
grant insert, update (rating, comment), delete on public.reviews to authenticated;

comment on table public.reservations is
  'Solicitudes de reserva. No garantiza inventario: la validación atómica de disponibilidad se implementará al activar reservas reales.';
comment on table public.availability_rules is
  'Horario semanal en la zona horaria del establecimiento; no representa cupos ni bloqueos de inventario.';
