import './globals.css';
import Link from 'next/link';
import { Home, Building2, Utensils, Calendar, User, Compass } from 'lucide-react';

export const metadata = {
  title: 'ReservaYa - Hoteles, Restaurantes y más',
  description: 'PWA para la gestión y reserva de hoteles, mesas de restaurantes y experiencias en tiempo real',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
                R
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ReservaYa
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Home className="w-4 h-4" /> Inicio
              </Link>
              <Link href="/reservar?category=hotels" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Hoteles
              </Link>
              <Link href="/reservar?category=restaurants" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Utensils className="w-4 h-4" /> Restaurantes
              </Link>
              <Link href="/reservar?category=experiences" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Experiencias
              </Link>
              <Link href="/reservar" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Mis Reservas
              </Link>
            </nav>

            {/* User Profile / Action */}
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Desktop Footer */}
        <footer className="hidden md:block bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <span className="text-lg font-bold text-white">ReservaYa</span>
              </div>
              <p className="text-sm text-slate-400">
                Tu plataforma integral para reservar hoteles, mesas de restaurantes y experiencias únicas con confirmación instantánea.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Categorías</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/reservar?category=hotels" className="hover:text-white transition-colors">Hoteles & Resorts</Link></li>
                <li><Link href="/reservar?category=restaurants" className="hover:text-white transition-colors">Restaurantes & Bares</Link></li>
                <li><Link href="/reservar?category=experiences" className="hover:text-white transition-colors">Spas & Bienestar</Link></li>
                <li><Link href="/reservar?category=experiences" className="hover:text-white transition-colors">Tours & Actividades</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Cancelación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">App Móvil PWA</h4>
              <p className="text-sm text-slate-400 mb-3">Instala ReservaYa en tu dispositivo para acceder sin conexión y recibir notificaciones en tiempo real.</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors shadow-lg shadow-blue-600/30">
                Instalar Aplicación
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © 2026 ReservaYa PWA. Todos los derechos reservados.
          </div>
        </footer>

        {/* Mobile Bottom Navigation (PWA style) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-2 flex justify-around items-center shadow-lg">
          <Link href="/" className="flex flex-col items-center text-slate-600 hover:text-blue-600 text-xs gap-1">
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </Link>
          <Link href="/reservar?category=hotels" className="flex flex-col items-center text-slate-600 hover:text-blue-600 text-xs gap-1">
            <Building2 className="w-5 h-5" />
            <span>Hoteles</span>
          </Link>
          <Link href="/reservar?category=restaurants" className="flex flex-col items-center text-slate-600 hover:text-blue-600 text-xs gap-1">
            <Utensils className="w-5 h-5" />
            <span>Restaurantes</span>
          </Link>
          <Link href="/reservar" className="flex flex-col items-center text-slate-600 hover:text-blue-600 text-xs gap-1">
            <Calendar className="w-5 h-5" />
            <span>Reservas</span>
          </Link>
          <Link href="/reservar" className="flex flex-col items-center text-slate-600 hover:text-blue-600 text-xs gap-1">
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
