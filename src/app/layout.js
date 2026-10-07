import './globals.css';

export const metadata = {
  title: 'ReservaYa - Tu cita al instante',
  description: 'PWA para la reserva de citas y servicios',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <header style={{ padding: '1rem', background: '#2563eb', color: 'white' }}>
          <h1>ReservaYa</h1>
        </header>
        <main style={{ padding: '1rem', minHeight: '80vh' }}>
          {children}
        </main>
        <footer style={{ padding: '1rem', textAlign: 'center', background: '#f3f4f6' }}>
          <p>© 2026 ReservaYa PWA - Todos los derechos reservados</p>
        </footer>
      </body>
    </html>
  );
}
