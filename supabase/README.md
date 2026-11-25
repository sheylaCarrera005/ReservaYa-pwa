# Base de datos de ReservaYa

## Alcance

Este esquema prepara la persistencia de ReservaYa sin modificar todavía las pantallas del prototipo. Incluye:

| Tabla | Responsabilidad |
| --- | --- |
| `profiles` | Nombre, teléfono y avatar de cada usuario de Supabase Auth. |
| `establishments` | Hoteles, restaurantes y experiencias del catálogo. |
| `bookable_items` | Habitaciones, mesas u ofertas que se pueden reservar, con capacidad y precio. |
| `availability_rules` | Horario semanal orientativo por elemento. |
| `reservations` | Periodo, personas, estado e importe calculado de cada reserva. |
| `reviews` | Una reseña por reserva completada. |
| `favorites` | Relación entre un usuario y sus establecimientos favoritos. |

Las categorías conservan los identificadores usados por el frontend: `hotels`, `restaurants` y `experiences`. Los precios usan `numeric` y un código de moneda, nunca texto como `$280 / noche`.

## Seguridad

Todas las tablas públicas tienen RLS. El catálogo publicado es de lectura pública; perfiles, reservas y favoritos son privados por usuario. Los clientes no tienen permiso para modificar el catálogo ni para confirmar sus propias reservas. Solo pueden crear solicitudes pendientes y cancelar reservas futuras propias.

El registro en Auth crea el perfil automáticamente. El precio, la moneda y el código de reserva se toman del catálogo en la base de datos: el navegador no puede decidir el importe. No uses `service_role` ni claves secretas en el frontend.

La gestión de establecimientos, confirmación de solicitudes y moderación de reseñas se hará después mediante un rol de personal separado. No se debe reutilizar ni permitir editar `raw_user_meta_data` para autorización.

## Instalación

Requisitos: Node.js 22+ y npm. El repositorio fija la CLI de Supabase en `package.json`; no hace falta instalarla globalmente.

```bash
npm install
```

### Proyecto remoto nuevo

1. Crea un proyecto vacío en [Supabase](https://supabase.com/dashboard/projects).
2. Obtén su **Project Reference ID** y guarda una copia de seguridad si tiene datos.
3. Desde la raíz del repositorio:

```bash
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push --remote --include-seed
```

La CLI v3 pide confirmación antes de modificar una base remota. No uses `--yes` sin revisar el proyecto enlazado. Estas migraciones presuponen una base nueva y no incorporan tablas de otras aplicaciones. `--include-seed` carga también el catálogo de demostración; omítelo para aplicar únicamente el esquema.

El seed es opcional, no contiene credenciales y se puede volver a ejecutar. También puedes ejecutarlo desde **SQL Editor**.

### Desarrollo completamente local

Instala y abre Docker Desktop y ejecuta:

```bash
npm run supabase:start
npm run db:reset
```

`db:reset` aplica migraciones y `seed.sql`, y **borra los datos de la base local**. Muestra la URL y las claves de desarrollo con `npx supabase status`. Configura `.env.local` a partir de `.env.example`. Docker no es necesario para las pruebas aisladas descritas abajo.

## Migraciones y pruebas

- `migrations/20261125194910_initial_reservaya_schema.sql`: esquema, índices, triggers, permisos y RLS.
- `seed.sql`: los ocho establecimientos de la interfaz y sus elementos reservables. Las valoraciones iniciales provienen de la demo visual; al añadir reseñas reales, los contadores se recalculan con esas reseñas.
- `migrations/20261125200641_backfill_reservaya_profiles.sql`: crea perfiles para cuentas de Auth anteriores al esquema.
- `tests/database.test.js`: pruebas con PostgreSQL en WASM mediante PGlite; no se conecta a Supabase ni requiere Docker.

```bash
npm run test:db
npm run db:lint       # requiere la base local de Supabase iniciada
npm run db:advisors   # revisa seguridad y rendimiento de la base local
```

Para cambios posteriores, crea una migración con `npx supabase migration new nombre_del_cambio`; no edites una migración que ya se haya aplicado en un entorno compartido.

## Consultas iniciales para conectar el frontend

Catálogo con sus elementos reservables:

```js
const { data, error } = await supabase
  .from('establishments')
  .select('*, bookable_items(*)')
  .eq('category', category)
  .eq('is_active', true)
  .eq('bookable_items.is_active', true);
```

Solicitud de una experiencia de 90 minutos para dos personas. `ends_at` puede omitirse: la base lo calcula con `duration_minutes`. Para hoteles, indica la salida para calcular las noches.

```js
const { data, error } = await supabase
  .from('reservations')
  .insert({
    customer_id: user.id,
    bookable_item_id: itemId,
    starts_at: '2027-05-10T15:00:00-06:00',
    party_size: 2,
    special_requests: 'Mesa junto a la ventana',
  })
  .select()
  .single();
```

## Datos adicionales para visualización

`supabase/seeds/demo_visualization.sql` añade tres establecimientos con imágenes, tres ofertas, cinco reservas demo, tres reseñas y tres favoritos. Requiere al menos un perfil, no crea cuentas y solo inserta el historial cuando no hay reservas. Desactiva temporalmente el trigger de reservas para crear el historial y lo restaura; debe ejecutarse con privilegios administrativos y únicamente para pruebas.

```bash
npm run db:seed:demo
```

Este lote no se carga mediante `--include-seed`: hay que solicitarlo explícitamente para evitar insertar datos ficticios en despliegues normales.

## Límite importante

Este esquema todavía no es un motor de inventario. Guarda solicitudes y sus horarios, pero no impide dos reservas simultáneas para la misma habitación o mesa. Antes de aceptar reservas reales se debe implementar disponibilidad transaccional (inventario por fechas o bloqueos con `btree_gist`), políticas de cancelación y un flujo de confirmación. Tampoco se han añadido pagos, cargos, notificaciones ni almacenamiento de imágenes.
