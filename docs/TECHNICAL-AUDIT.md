# Auditoría técnica y estructural de ReservaYa

## 1. Introducción

Esta auditoría analiza el estado actual del frontend de ReservaYa, una aplicación web para consultar y simular reservas de hoteles, restaurantes y experiencias. El alcance comprende la estructura del repositorio, la organización del código React/Next.js, la separación de responsabilidades, la configuración PWA y las condiciones de mantenibilidad para un equipo universitario.

La revisión se realizó sobre los archivos presentes en el repositorio, excluyendo las dependencias instaladas (`node_modules`) y la salida generada de Next.js (`.next`). Las recomendaciones son propuestas para etapas posteriores: no se modificó, eliminó ni reubicó código existente.

## 2. Resumen ejecutivo

El proyecto utiliza una estructura mínima y válida de Next.js con App Router:

- `src/app/layout.js` define el layout raíz, metadatos, navegación global y footer.
- `src/app/page.js` define la página inicial y concentra el buscador, categorías y destacados.
- `src/app/reservar/page.js` define el listado por categoría y el formulario de simulación de reserva.
- `src/app/globals.css` contiene los estilos base de Tailwind.
- `public/manifest.json` declara metadatos de instalación PWA.

La base es adecuada para un prototipo y permite entender rápidamente el flujo principal. Sin embargo, la mayoría de la interfaz, el estado, los datos de ejemplo y la lógica de interacción están concentrados en dos archivos grandes. Esto aumenta el acoplamiento, dificulta el trabajo paralelo y hará más costosa la incorporación de autenticación, disponibilidad real, pagos o persistencia.

El aspecto más importante de la revisión PWA es que existe un manifiesto, pero no se encontró un Service Worker, un registro de Service Worker ni una estrategia de caché/offline. Además, el manifiesto referencia `/icons/icon-192x192.png` y `/icons/icon-512x512.png`, pero no existe la carpeta `public/icons` en el repositorio revisado. Por tanto, la presencia del manifiesto no demuestra por sí sola que la aplicación sea instalable ni que funcione offline.

No se detectaron APIs, servicios de datos, autenticación, persistencia de reservas ni pruebas automatizadas en los archivos revisados. La confirmación de reserva es explícitamente una simulación visual.

## 3. Tecnologías identificadas

| Tecnología o herramienta | Evidencia | Uso observado |
|---|---|---|
| JavaScript | `src/app/**/*.js` | Componentes y lógica de interfaz |
| React 19 | `package.json` | Componentes, estado con `useState` y efectos con `useEffect` |
| Next.js 15 | `package.json`, `src/app` | App Router, layouts y navegación |
| Tailwind CSS 3 | `package.json`, `tailwind.config.js`, `globals.css` | Estilos utilitarios y estilos base |
| PostCSS/Autoprefixer | `postcss.config.js` | Procesamiento de CSS |
| lucide-react | `package.json` e imports | Iconos de la interfaz |
| npm | `package.json`, `package-lock.json` | Gestión de dependencias y scripts |

No se identificaron TypeScript, una biblioteca de pruebas, ESLint configurado en los scripts, una capa de llamadas HTTP ni una biblioteca de estado global.

## 4. Estructura actual del repositorio

```text
/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── public/
│   └── manifest.json
└── src/
    └── app/
        ├── globals.css
        ├── layout.js
        ├── page.js
        └── reservar/
            └── page.js
```

### Responsabilidades actuales

- **`src/app/layout.js`**: importa los estilos globales, declara `metadata`, define el `<html>` en español, configura el `theme-color` y contiene la navegación superior, el contenido principal, el footer y la navegación móvil. También es responsable de enlaces hacia las categorías.
- **`src/app/page.js`**: es un Client Component. Gestiona las pestañas del buscador (`hotels`, `restaurants`, `experiences`) y los valores de destino, fecha y personas. También renderiza el grid de categorías y tres tarjetas destacadas con datos escritos directamente en JSX.
- **`src/app/reservar/page.js`**: es un Client Component que usa `useSearchParams`. Lee `category` desde la URL, mantiene la categoría e ítem seleccionado, contiene el catálogo simulado de las tres categorías y renderiza el formulario de confirmación simulada.
- **`src/app/globals.css`**: importa las capas de Tailwind y define estilos base del `body`.
- **`public/manifest.json`**: declara nombre, URL inicial, modo standalone, colores e iconos esperados para la instalación.
- **`tailwind.config.js`**: incluye las rutas de `src/pages`, `src/components` y `src/app` como contenido de Tailwind. Actualmente no existen `src/pages` ni `src/components`, pero la inclusión permite crearlas posteriormente.

La organización actual corresponde a una arquitectura de páginas basada en Next.js App Router, no a una arquitectura feature-based. Para el tamaño actual es comprensible, aunque las páginas ya concentran responsabilidades suficientes para justificar una separación gradual.

## 5. Evaluación de modularidad

### Archivos con alta concentración de responsabilidades

| Archivo | Responsabilidades observadas | Evaluación |
|---|---|---|
| `src/app/layout.js` | Layout, navegación de escritorio, navegación móvil, footer, enlaces de categorías y contenido promocional de PWA | La responsabilidad de layout global es válida, pero las tres áreas de navegación y el footer están embebidos en un único componente. |
| `src/app/page.js` | Estado del buscador, tabs, campos de búsqueda, enlace de resultados, categorías y tarjetas destacadas | Es el archivo más concentrado funcionalmente: mezcla búsqueda, catálogo visual y datos de presentación. |
| `src/app/reservar/page.js` | Lectura de URL, estado de selección, catálogo simulado, filtros visuales, listado, formulario y confirmación | Mezcla datos, reglas de selección y varias vistas. Es el principal punto de acoplamiento del flujo de reserva. |

No se establece aquí un límite arbitrario de líneas; el problema es la cantidad de responsabilidades que deben modificarse juntas. Por ejemplo, añadir una cuarta categoría requeriría actualizar datos, textos, iconos, colores y condiciones distribuidas en la misma página.

### Repetición y reutilización potencial

- Los enlaces de categoría aparecen en la barra superior, footer, navegación móvil, buscador, grid de categorías y tarjetas destacadas.
- Los botones de pestaña y los botones de selección repiten clases y condiciones visuales.
- Las tarjetas de categoría y las tarjetas destacadas podrían modelarse como componentes parametrizados.
- Los datos de catálogo y los datos de destacados están mezclados con la presentación; podrían extraerse a módulos de datos o servicios cuando exista backend.
- La selección de categoría usa cadenas literales repetidas (`hotels`, `restaurants`, `experiences`). Un módulo de constantes reduciría errores de escritura y facilitaría validación.

### Propuesta concreta de división futura

Sin implementarla como parte de esta auditoría, una división razonable sería:

- `src/components/layout/Header.js`: navegación superior.
- `src/components/layout/Footer.js`: footer.
- `src/components/layout/MobileNav.js`: navegación inferior móvil.
- `src/components/home/SearchWidget.js`: tabs y campos de búsqueda.
- `src/components/home/CategoryCard.js`: tarjeta reutilizable de categoría.
- `src/components/home/FeaturedCard.js`: tarjeta de destacado.
- `src/components/booking/CategorySwitcher.js`: cambio de categoría.
- `src/components/booking/ListingCard.js`: elemento del catálogo.
- `src/components/booking/BookingSummary.js`: formulario y resultado de confirmación.
- `src/data/mockItems.js`: datos simulados, mientras no exista una API.
- `src/lib/categories.js`: identificadores, etiquetas y metadatos compartidos.

La extracción debe hacerse por responsabilidad y no por fragmentar cada bloque pequeño. Las páginas deberían conservar la composición de la pantalla y delegar la presentación o los datos especializados.

## 6. Evaluación de arquitectura

### Patrón actual

El proyecto utiliza el App Router de Next.js: `layout.js` funciona como layout raíz, `page.js` corresponde a `/` y `reservar/page.js` corresponde a `/reservar`. La navegación se realiza con `next/link` y la página de reservas lee parámetros mediante `useSearchParams`.

El patrón es apropiado para un prototipo. También aprovecha correctamente la separación de rutas que ofrece Next.js. No obstante, las dos páginas principales son Client Components completos, aunque parte de su contenido es estático. Eso hace que datos y renderizado se mantengan juntos y dificulta aprovechar una separación entre componentes de servidor y componentes interactivos.

### Acoplamientos observados

1. La categoría se representa como una cadena en varios lugares y controla textos, iconos, colores y datos.
2. `page.js` construye la URL de búsqueda, pero `reservar/page.js` solo consume `category`; el parámetro `destination` se genera pero no se utiliza para filtrar o mostrar resultados.
3. La lógica de confirmación solo cambia `bookingConfirmed`; no crea una reserva, no persiste datos y no llama a un backend.
4. El contenido visual de las imágenes destacadas usa fondos de Tailwind e iconos, no archivos de imagen. Esto es coherente con un prototipo, pero la estructura no incluye una capa de recursos visuales.
5. El botón “Iniciar Sesión”, el botón “Instalar Aplicación” y los enlaces `href="#"` no tienen comportamiento implementado. Deben considerarse superficies pendientes, no errores de compilación.

### Adecuación para la aplicación prevista

Para una aplicación de hoteles, restaurantes y experiencias, una organización por funcionalidades sería más escalable:

- **home**: descubrimiento y búsqueda.
- **booking**: catálogo, filtros, selección y reserva.
- **auth**: autenticación y perfil cuando se implemente.
- **shared**: componentes y utilidades verdaderamente compartidos.
- **data/services**: acceso a API, disponibilidad y persistencia.

No es necesario reestructurar todo de inmediato. Se recomienda extraer primero los componentes más grandes y los datos simulados, y establecer contratos de datos antes de integrar un backend.

## 7. Evaluación de la implementación PWA

### Elementos presentes

- `public/manifest.json` existe y declara `name`, `short_name`, `start_url`, `display: "standalone"`, colores, descripción e iconos.
- `src/app/layout.js` expone el manifiesto mediante `metadata.manifest` y define un `theme-color`.
- La interfaz incluye una navegación inferior orientada a móvil y utiliza estilos responsive de Tailwind.

### Elementos faltantes o que requieren validación

| Elemento | Estado comprobado | Implicación |
|---|---|---|
| Service Worker | No se encontró archivo, registro en `navigator.serviceWorker` ni configuración equivalente | No hay evidencia de caché, interceptación de red ni funcionamiento offline. |
| Estrategia de caché | No implementada en los archivos revisados | La aplicación no tiene una política explícita para recursos, datos o fallback offline. |
| Iconos del manifiesto | `manifest.json` apunta a `/icons/icon-192x192.png` y `/icons/icon-512x512.png`, pero no existe `public/icons` | La instalación puede fallar o mostrar iconos ausentes. Debe validarse con DevTools/Lighthouse y corregirse antes de presentar la PWA como instalable. |
| Offline | No se encontró página fallback, almacenamiento local ni manejo offline | No puede afirmarse que el flujo de consulta o reserva funcione sin conexión. |
| Notificaciones | Solo existe texto que promete confirmación en el dispositivo; no se encontró API de notificaciones ni suscripción push | El texto describe una capacidad no implementada en el código revisado. |
| HTTPS | No se encontró configuración de despliegue o certificado en el repositorio | Debe comprobarse en el entorno de despliegue; HTTPS es requisito habitual para Service Workers fuera de localhost. |
| Instalabilidad real | No verificada con navegador | El manifiesto es necesario, pero no suficiente; se deben validar iconos, respuestas HTTP, HTTPS y criterios del navegador. |

## 8. Explicación del funcionamiento

### Carga inicial

1. Next.js entra por la ruta `/` y renderiza `src/app/page.js`.
2. Antes de mostrar la página, `src/app/layout.js` envuelve el contenido con el layout raíz.
3. El layout importa `src/app/globals.css`, coloca la navegación global y renderiza `{children}` dentro de `<main>`.
4. `page.js` se ejecuta en el cliente porque declara `'use client'`. Inicialmente selecciona la pestaña `hotels` y deja vacíos el destino y la fecha.

### Búsqueda desde la pantalla principal

1. El usuario cambia la pestaña; `setActiveTab` cambia la categoría visual y los textos de los campos.
2. Los inputs actualizan `destination`, `date` y `guests`.
3. El enlace de búsqueda navega a `/reservar?category=<categoría>&destination=<destino>`.
4. La ruta `/reservar` renderiza `src/app/reservar/page.js`. Su `Suspense` muestra un texto de carga mientras se resuelven los parámetros de búsqueda.
5. `ReservarContent` obtiene `category` desde `useSearchParams`. El parámetro `destination` no se usa en la lógica actual, por lo que la búsqueda no restringe el catálogo mostrado.

### Selección y simulación de reserva

1. `reservar/page.js` obtiene la lista de `mockItems` correspondiente a `hotels`, `restaurants` o `experiences`.
2. Cada elemento se renderiza como una tarjeta. Al hacer clic, `selectedItem` guarda el objeto seleccionado.
3. El panel “Resumen de Reserva” muestra campos de fecha, cantidad y una tarifa basada directamente en `selectedItem.price`.
4. Al enviar el formulario, `handleConfirmBooking` evita el envío HTML y establece `bookingConfirmed` en `true`.
5. La vista cambia a un mensaje de éxito simulado. No se guarda la reserva ni se realiza una solicitud de red.

### Navegación y recursos

- Los enlaces internos usan `next/link`, por ejemplo `/reservar?category=hotels`.
- Los iconos provienen de `lucide-react`.
- Los estilos se aplican principalmente mediante clases Tailwind en los JSX.
- El único recurso público identificado es `public/manifest.json`; no se localizaron imágenes ni iconos en `public/`.

La relación entre disponibilidad, usuarios, reservas reales y notificaciones no puede comprenderse completamente porque no existe una capa de datos o backend en el repositorio revisado.

## 9. Problemas y oportunidades de mejora

Las observaciones siguientes distinguen hechos comprobados de riesgos que requieren validación adicional.

| Prioridad | Archivo o directorio | Tipo | Problema identificado | Por qué es inconveniente | Recomendación concreta | Beneficio esperado |
|---|---|---|---|---|---|---|
| Alto | `public/manifest.json`, `public/` | Comprobado | Se declaran dos iconos que no están presentes en el árbol revisado. | Puede impedir una instalación correcta o producir iconos rotos. | Añadir los recursos en las rutas declaradas o ajustar el manifiesto y verificarlo con DevTools/Lighthouse. | Instalación PWA consistente y branding visible. |
| Alto | `src/app/`, `public/` | Comprobado | No hay Service Worker, registro ni estrategia offline. | El proyecto no ofrece evidencia de caché ni funcionamiento sin conexión. | Definir una estrategia explícita de Service Worker, caché y fallback, y probarla en producción sobre HTTPS. | Comportamiento PWA verificable y resiliente. |
| Alto | `src/app/page.js` | Comprobado | La página inicial concentra estado, búsqueda, categorías y destacados. | Los cambios de una funcionalidad pueden afectar una pantalla extensa y generan conflictos entre integrantes. | Extraer componentes de `home` y mover datos de presentación a módulos separados. | Menor acoplamiento y revisiones más sencillas. |
| Alto | `src/app/reservar/page.js` | Comprobado | Catálogo, estado de selección, formulario y confirmación conviven en un solo archivo. | Integrar disponibilidad real o validaciones requerirá modificar demasiadas responsabilidades juntas. | Separar datos, tarjetas, selector y resumen de reserva; definir una interfaz de datos común. | Evolución más segura hacia reservas reales. |
| Alto | `src/app/page.js`, `src/app/reservar/page.js` | Comprobado | `destination` se envía en la URL pero no se consume. | El usuario puede creer que buscó una zona específica aunque vea el catálogo completo. | Leer, validar y aplicar el parámetro, o eliminarlo hasta implementar el filtro. | Comportamiento coherente y menor confusión. |
| Alto | `src/app/reservar/page.js` | Comprobado | La confirmación solo cambia estado local y usa datos simulados. | No existe persistencia, disponibilidad, identidad del usuario ni confirmación real. | Mantener el modo demo explícito y, cuando corresponda, conectar una API con estados de carga y error. | Separación clara entre prototipo y funcionalidad operativa. |
| Medio | `src/app/layout.js` | Comprobado | Header, footer y navegación móvil están embebidos en el layout. | El layout crecerá con cada cambio de navegación o cuenta de usuario. | Extraer componentes de layout y mantener en el layout solo la composición. | Menos conflictos y mejor reutilización. |
| Medio | `src/app/page.js`, `src/app/reservar/page.js` | Comprobado | Hay cadenas de categorías y estilos condicionales repetidos. | Pueden aparecer categorías inválidas o inconsistencias entre pantallas. | Centralizar identificadores, etiquetas, iconos y metadatos de categoría. | Consistencia y extensibilidad. |
| Medio | `package.json` | Comprobado | Solo existen scripts `dev`, `build` y `start`; no hay pruebas ni lint configurados. | La calidad depende de revisión manual y se detectan regresiones más tarde. | Añadir gradualmente lint y pruebas de componentes/flujo, manteniendo las herramientas compatibles con el proyecto. | Validación reproducible para el equipo. |
| Medio | `src/app/layout.js` | Comprobado | Hay botones y enlaces sin comportamiento (`Iniciar Sesión`, `Instalar Aplicación`, `href="#"`). | La interfaz comunica capacidades que aún no están conectadas. | Definir rutas, handlers o estados “próximamente”; evitar acciones silenciosas. | UX más honesta y menor ambigüedad. |
| Bajo | Todo el proyecto | Comprobado | El README solo contiene una descripción breve. | Un nuevo integrante no tiene instrucciones de ejecución, arquitectura ni alcance del prototipo. | Ampliar la documentación del proyecto en una etapa separada, incluyendo comandos y límites funcionales. | Onboarding y revisión académica más rápidos. |
| Bajo | `src/app/page.js`, `src/app/reservar/page.js` | Riesgo a validar | El contenido estático incluye tarjetas y textos extensos directamente en JSX. | Puede aumentar el costo de traducción, edición y pruebas visuales. | Extraer modelos de datos y componentes parametrizados cuando el contenido crezca. | Mantenimiento editorial más simple. |

No se identificó un problema crítico comprobado en el código disponible. Los riesgos de seguridad, autenticación y autorización no pueden evaluarse en profundidad porque no existe backend ni manejo de credenciales en este repositorio; deben auditarse cuando se incorpore esa capa.

## 10. Propuesta de estructura mejorada

La siguiente estructura es una recomendación, no una instrucción de reorganización inmediata. Mantiene Next.js, React, Tailwind y lucide-react.

```text
/
├── public/
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── manifest.json
│   └── ...recursos estáticos...
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── reservar/
│   │       └── page.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── MobileNav.js
│   │   ├── home/
│   │   │   ├── SearchWidget.js
│   │   │   ├── CategoryCard.js
│   │   │   └── FeaturedCard.js
│   │   └── booking/
│   │       ├── CategorySwitcher.js
│   │       ├── ListingCard.js
│   │       └── BookingSummary.js
│   ├── data/
│   │   └── mockItems.js
│   ├── lib/
│   │   └── categories.js
│   └── services/
│       └── reservations.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

### Responsabilidad de las áreas

- `app/`: rutas y composición de páginas. `layout.js` debe conservar la envoltura global y cada `page.js` debe coordinar la pantalla.
- `components/layout/`: navegación y elementos que se muestran en varias rutas.
- `components/home/`: piezas propias de descubrimiento y búsqueda.
- `components/booking/`: piezas del catálogo y del flujo de reserva.
- `data/`: datos de demostración aislados del JSX mientras no exista backend.
- `lib/`: constantes, normalización y utilidades puras compartidas.
- `services/`: llamadas a API, disponibilidad y persistencia; debe incorporar manejo explícito de carga y error cuando se implemente.
- `public/icons/`: iconos referenciados por el manifiesto y demás recursos que no requieren procesamiento de Next.js.

Los archivos actuales pueden permanecer como puntos de entrada. `page.js` y `reservar/page.js` se dividirían gradualmente, no se reemplazarían por una reescritura completa. `layout.js` seguiría siendo el lugar del layout raíz, delegando Header, Footer y MobileNav.

## 11. Plan de mejora recomendado

### Etapa 1: Corrección y documentación PWA

1. Confirmar la versión objetivo de Next.js y el entorno de despliegue.
2. Resolver la discrepancia entre los iconos declarados y los archivos existentes.
3. Decidir si el alcance requiere offline real, caché de assets, notificaciones o solo instalabilidad.
4. Implementar y probar el Service Worker únicamente después de definir esa estrategia.
5. Validar instalación, manifest, iconos, HTTPS y comportamiento offline en un entorno de producción.

### Etapa 2: Modularización de bajo riesgo

1. Extraer Header, Footer y MobileNav desde `layout.js`.
2. Extraer el buscador, tarjetas de categoría y tarjetas destacadas desde `page.js`.
3. Extraer `ListingCard` y `BookingSummary` desde `reservar/page.js`.
4. Mantener el comportamiento visual y los identificadores de ruta durante la extracción.

### Etapa 3: Modelo de datos y navegación coherentes

1. Centralizar las categorías y sus metadatos.
2. Mover `mockItems` a `src/data/mockItems.js`.
3. Consumir o eliminar el parámetro `destination` de forma explícita.
4. Añadir validación de categorías desconocidas y estados de carga, vacío y error.

### Etapa 4: Calidad colaborativa

1. Incorporar lint y pruebas automatizadas con una configuración acordada por el equipo.
2. Definir convenciones de nombres, ramas y revisión.
3. Ampliar el README con instalación, comandos, estructura, límites del prototipo y flujo principal.
4. Revisar accesibilidad: nombres accesibles para iconos, foco de teclado, labels y mensajes de error.

### Etapa 5: Integración funcional

1. Diseñar contratos de API para catálogo, disponibilidad y reservas.
2. Mover el acceso a datos a `services/`.
3. Implementar autenticación y autorización antes de almacenar reservas asociadas a usuarios.
4. Añadir persistencia, manejo de errores, idempotencia y observabilidad.
5. Auditar seguridad y privacidad cuando exista backend.

## 12. Conclusiones

ReservaYa tiene una base clara para un prototipo: usa una estructura estándar de Next.js, separa las rutas principales y presenta un flujo comprensible desde la búsqueda hasta una confirmación simulada. La elección de Tailwind y los componentes de iconos permite construir rápidamente una interfaz responsive.

La principal limitación actual no es la cantidad de carpetas, sino la concentración de responsabilidades en `layout.js`, `page.js` y `reservar/page.js`. La segunda limitación es que las características PWA están incompletas: existe un manifiesto, pero faltan iconos presentes en disco y no se encontró Service Worker ni soporte offline verificable.

Se recomienda avanzar de forma incremental: primero aclarar y validar el alcance PWA, después modularizar las pantallas sin cambiar su comportamiento, y finalmente separar datos y servicios antes de conectar disponibilidad o reservas reales. Con ese orden se conserva el prototipo existente, se reducen conflictos del equipo y se prepara el proyecto para crecer sin una reestructuración innecesaria.
