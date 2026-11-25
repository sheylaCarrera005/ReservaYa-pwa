# Base de datos de ReservaYa

Guía para el equipo: qué guarda Supabase, cómo se relacionan las tablas y qué reglas de seguridad se aplican.

> **Estado:** el esquema y los datos de demostración ya están aplicados en el proyecto remoto **ReservaYa**. El frontend todavía usa datos simulados; la conexión de las pantallas se hará por separado.

## 1. Idea general

ReservaYa utiliza **PostgreSQL en Supabase**. Supabase Auth administra el registro, el inicio de sesión y las contraseñas; nuestras tablas guardan el catálogo, los perfiles y las futuras reservas.

La estructura principal es:

```text
Usuario de Auth
└── profiles (datos editables del usuario)
    ├── reservations
    │   └── reviews (máximo una por reserva)
    └── favorites

establishments (hotel, restaurante o experiencia)
└── bookable_items (habitación, mesa u oferta)
    ├── availability_rules (horario semanal)
    └── reservations
```

Un usuario puede tener varias reservas y favoritos. Un establecimiento puede ofrecer varios elementos reservables. Cada reseña pertenece a una reserva completada del mismo usuario.

## 2. Las siete tablas

### `profiles`: datos del usuario

Complementa a `auth.users`; **no guarda contraseñas**.

| Campo | Uso |
| --- | --- |
| `id` | UUID igual al identificador de Supabase Auth. |
| `full_name` | Nombre visible, de 1 a 80 caracteres. |
| `phone` | Teléfono opcional. |
| `avatar_url` | Dirección opcional de la imagen de perfil. |
| `created_at`, `updated_at` | Fechas de creación y última modificación. |

Al registrarse un usuario, un trigger crea su perfil automáticamente. También existe una migración para crear perfiles de cuentas que ya existían antes de instalar el esquema.

### `establishments`: el catálogo

Guarda hoteles, restaurantes y experiencias que aparecen en la aplicación.

| Campo | Uso |
| --- | --- |
| `id` | Identificador UUID único. |
| `owner_id` | Perfil propietario opcional, preparado para administración futura. |
| `category` | `hotels`, `restaurants` o `experiences`; coincide con el frontend. |
| `slug` | Nombre único para URLs, por ejemplo `grand-azure-resort-spa`. |
| `name`, `description` | Nombre y descripción mostrados al usuario. |
| `location`, `address`, `city`, `country_code` | Información geográfica. |
| `timezone` | Zona horaria para interpretar sus horarios. |
| `phone`, `email` | Datos de contacto opcionales. |
| `image_url` | Imagen principal opcional; no hay Storage implementado aún. |
| `tags` | Etiquetas como `Todo Incluido` o `Boutique`. |
| `is_active` | Controla si aparece en el catálogo público. |
| `rating_average`, `review_count` | Promedio y número de reseñas publicadas. |

Las valoraciones iniciales provienen del diseño demo. Cuando se añaden, editan o eliminan reseñas reales, la base recalcula estos contadores con las reseñas publicadas.

### `bookable_items`: lo que se reserva

Representa la oferta concreta dentro de un establecimiento: una habitación, una mesa o una experiencia.

| Campo | Uso |
| --- | --- |
| `establishment_id` | Establecimiento al que pertenece. |
| `name`, `description` | Nombre y detalle de la oferta. |
| `capacity` | Número máximo de personas por reserva. |
| `duration_minutes` | Duración de una mesa o experiencia. |
| `unit_price` | Precio numérico, sin símbolos ni texto. |
| `currency` | Moneda ISO de tres letras; actualmente `USD` en la demo. |
| `pricing_unit` | `night`, `person` o `booking`. |
| `check_in_time`, `check_out_time` | Horario orientativo para hoteles. |
| `is_active` | Permite ocultar una oferta sin eliminarla. |

### `availability_rules`: horario semanal

Indica en qué días y franjas horarias se puede ofrecer un elemento.

- `day_of_week`: de **0 (domingo) a 6 (sábado)**.
- `start_time` y `end_time`: inicio y fin de la franja.
- `is_available`: permite cerrar una franja sin borrarla.

**Importante:** estos registros son horarios generales, no cupos disponibles ni bloqueos de inventario.

### `reservations`: solicitudes y reservas

| Campo | Uso |
| --- | --- |
| `booking_code` | Código único generado por la base, por ejemplo `RY-...`. |
| `customer_id` | Usuario que solicita la reserva. |
| `bookable_item_id` | Habitación, mesa u oferta seleccionada. |
| `starts_at`, `ends_at` | Inicio y fin con fecha, hora y zona horaria. |
| `party_size` | Cantidad de personas. |
| `status` | Estado de la reserva, descrito abajo. |
| `unit_price`, `total_price`, `currency` | Importes copiados/calculados desde el catálogo. |
| `special_requests` | Solicitudes opcionales del cliente. |
| `cancellation_reason`, `cancelled_at` | Motivo y fecha de cancelación. |

Estados permitidos:

| Estado | Significado |
| --- | --- |
| `pending` | Solicitud creada por el cliente; aún no confirmada. |
| `confirmed` | Aceptada por el personal; todavía no hay interfaz administrativa. |
| `cancelled` | Cancelada por el cliente o mediante administración futura. |
| `completed` | Servicio terminado; permite dejar una reseña. |

### `reviews`: reseñas

Contiene la valoración de 1 a 5, un comentario opcional y la relación con la reserva. Solo se puede crear una reseña por reserva y debe ser una reserva **propia y completada**.

### `favorites`: favoritos

Relaciona `customer_id` con `establishment_id`. La combinación es única para impedir favoritos duplicados. Cada usuario solo puede consultar, añadir o eliminar los suyos.

## 3. Seguridad: RLS y permisos

Todas las tablas del esquema público tienen **Row Level Security (RLS)**. RLS decide qué filas puede ver o cambiar cada usuario; no basta con ocultar botones en la interfaz.

| Acción | Visitante | Usuario autenticado |
| --- | --- | --- |
| Consultar establecimientos activos | Sí | Sí |
| Consultar ofertas y horarios activos | Sí | Sí |
| Leer reseñas publicadas | Sí | Sí |
| Consultar/editar su perfil | No | Solo el propio |
| Crear una solicitud de reserva | No | Solo a su nombre |
| Consultar reservas | No | Solo las propias |
| Cancelar reservas | No | Solo propias, futuras y pendientes/confirmadas |
| Gestionar favoritos | No | Solo los propios |
| Escribir una reseña | No | Solo de su reserva completada |
| Modificar el catálogo | No | No |
| Confirmar sus propias reservas | No | No |

Los permisos están separados: un usuario autenticado no puede consultar las reservas de otro ni convertirse en administrador cambiando datos del navegador. La gestión del catálogo y la confirmación por personal requerirán un rol administrativo seguro en una etapa posterior.

**Nunca compartas ni uses en el frontend una `service_role` o clave secreta.** La URL pública y la clave publicable de `.env.local` no deben copiarse a documentos compartidos ni capturas.

## 4. Reglas automáticas

La base, no el navegador, se encarga de:

- Crear el perfil cuando aparece un usuario nuevo en Auth.
- Actualizar `updated_at` al modificar registros editables.
- Rechazar reservas en el pasado o con más personas que la capacidad.
- Calcular la hora final de restaurantes y experiencias con `duration_minutes`.
- Calcular el total: precio por noche y cantidad de noches, por persona, o por reserva.
- Impedir que el cliente cambie el precio, la moneda, el estado inicial o el código de reserva.
- Recalcular promedio y número de reseñas publicadas del establecimiento.

## 5. Datos de demostración

`supabase/seed.sql` contiene:

- **3 hoteles:** Grand Azure Resort & Spa, Hotel Boutique Altamira y Alpine Lodge & Ski Resort.
- **3 restaurantes:** La Cúpula Bistró & Vino, Sakura Sushi & Robata y Trattoria del Nonna.
- **2 experiencias:** Zenith Hydrothermal Spa y Tour Gastronómico Nocturno.
- **8 ofertas reservables**, una por establecimiento.
- **56 horarios**, siete franjas semanales por oferta.

Además, `supabase/seeds/demo_visualization.sql` amplía los datos visuales con tres establecimientos (Hotel Casa del Lago, Cocina del Mercado y Paseo en Kayak al Amanecer), tres ofertas, imágenes externas, cinco reservas de demostración, tres reseñas y tres favoritos. El catálogo remoto tiene en total **11 establecimientos, 11 ofertas y 77 horarios**.

El lote adicional asocia los datos privados al primer perfil existente; no crea usuarios ni credenciales. Sus comentarios indican expresamente que son demostración. Solo carga el historial cuando la tabla de reservas está vacía y puede repetirse sin duplicar catálogo, reseñas ni favoritos. Requiere un administrador de base de datos porque ajusta temporalmente el trigger para crear el historial; no es una operación disponible para usuarios de la aplicación.

Para cargarlo explícitamente en el proyecto remoto enlazado:

```bash
npm run db:seed:demo
```

La CLI pedirá confirmación. Este comando es solo para entornos de prueba y no se incluye en `db push --include-seed`.

## 6. Archivos del repositorio

```text
supabase/
├── migrations/
│   ├── 20261125194910_initial_reservaya_schema.sql
│   └── 20261125200641_backfill_reservaya_profiles.sql
├── seed.sql
├── seeds/
│   └── demo_visualization.sql
├── tests/
│   └── database.test.js
├── config.toml
└── README.md
```

- La primera migración crea tipos, tablas, índices, funciones, triggers, permisos y RLS.
- La segunda crea perfiles para usuarios de Auth anteriores al esquema.
- `seed.sql` carga el catálogo de demostración.
- `supabase/tests/database.test.js` prueba el esquema sin conectarse al proyecto remoto.

## 7. Trabajar con el proyecto

```bash
npm install
npm run test:db
```

Las pruebas no necesitan Docker ni credenciales y no modifican Supabase. Cubren el catálogo, perfiles, precios, capacidad, fechas, aislamiento de usuarios y reseñas.

### Consultar el catálogo desde JavaScript

```js
const { data, error } = await supabase
  .from('establishments')
  .select('*, bookable_items(*)')
  .eq('category', 'hotels')
  .eq('is_active', true);
```

`category` debe ser `hotels`, `restaurants` o `experiences`.

### Crear una solicitud de reserva

El usuario debe haber iniciado sesión. `user.id` se obtiene de Supabase Auth.

```js
const { data, error } = await supabase
  .from('reservations')
  .insert({
    customer_id: user.id,
    bookable_item_id: itemId,
    starts_at: '2027-05-10T15:00:00-06:00',
    party_size: 2,
    special_requests: 'Solicitud especial opcional',
  })
  .select()
  .single();
```

Para una experiencia o restaurante no hace falta enviar `ends_at`. Para un hotel sí debe indicarse la fecha de salida y calcular las noches.

### Crear una migración nueva

No edites migraciones que ya se aplicaron al proyecto compartido. Crea otra:

```bash
npx supabase migration new nombre_del_cambio
```

Después, revisa el SQL y pruébalo antes de aplicarlo. La CLI v3 usa la base local por defecto; para cambiar el remoto se debe indicar explícitamente `--remote` y confirmar el proyecto correcto. **No ejecutes `db reset` contra una base compartida: borra sus datos.**

## 8. Qué falta implementar

La estructura está preparada para avanzar, pero todavía no ofrece un sistema completo de reservas reales:

- Conexión del catálogo y formularios del frontend con estas tablas.
- Inventario transaccional para impedir reservas duplicadas en la misma habitación o mesa.
- Disponibilidad real por fechas, horarios y cantidad de unidades.
- Panel y permisos de personal para confirmar reservas y administrar el catálogo.
- Políticas de cancelación, pagos y notificaciones.
- Almacenamiento de imágenes en Supabase Storage.

Por tanto, las reservas actuales son **solicitudes persistidas**, no una garantía de disponibilidad. No deben presentarse como confirmaciones automáticas de inventario.
