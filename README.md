# ReservaYa

ReservaYa es un prototipo web para descubrir hoteles, restaurantes y experiencias, y simular una reserva. Utiliza Next.js App Router, React, Tailwind CSS y lucide-react.

Creado por:
- Emanuel Ovando 
- Javier Montero 
- Sheila López 
- Raúl de la Cruz


## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Los comandos para producción son `npm run build` y `npm start`.

## Probar la demo

Para probar la demo con la autenticación de Supabase, instala la biblioteca con:

```bash
npm install @supabase/supabase-js
```

También puedes comprobar que el proyecto compile ejecutando:

```bash
npm run build
```

## Alcance actual

- `/` ofrece el descubrimiento de categorías y un formulario de búsqueda.
- `/reservar` muestra listados de ejemplo y una confirmación simulada que solo se procesa localmente.
- El registro y el inicio de sesión con correo electrónico y contraseña de Supabase están disponibles en `/auth/register` y `/auth/signin` cuando se configuran. Todavía no existen disponibilidad real, pagos ni persistencia de reservas.
- El manifiesto existe, pero los archivos de iconos referenciados, el service worker y el comportamiento sin conexión no están implementados. No describas la aplicación actual como compatible con el uso sin conexión ni como completamente instalable.

## Configuración de la autenticación de Supabase

Copia `.env.example` como `.env.local` y define `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `NEXT_PUBLIC_SITE_URL` con los valores de tu proyecto de Supabase y la URL de la aplicación local o desplegada. Activa la autenticación por correo electrónico en Supabase Auth y agrega `http://localhost:3000/auth/callback` (y su equivalente desplegado) a las URL de redirección permitidas. Si la confirmación por correo está activada, los usuarios deben confirmar su dirección; si está desactivada, el registro inicia la sesión inmediatamente. Reinicia el servidor de desarrollo después de cambiar las variables de entorno.
