-- Sincroniza cuentas creadas antes de instalar el trigger de ReservaYa.
-- Los registros nuevos siguen siendo creados por on_auth_user_created_reservaya.
insert into public.profiles (id, full_name)
select
  u.id,
  coalesce(
    nullif(left(btrim(u.raw_user_meta_data ->> 'full_name'), 80), ''),
    nullif(left(btrim(u.raw_user_meta_data ->> 'name'), 80), ''),
    'Usuario de ReservaYa'
  )
from auth.users u
on conflict (id) do nothing;
