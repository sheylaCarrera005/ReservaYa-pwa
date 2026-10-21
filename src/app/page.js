'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Utensils, Compass, Sparkles, Star, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2 personas');

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/30 backdrop-blur-md text-blue-200 text-xs font-semibold tracking-wide border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" /> Reserva hoteles, mesas y experiencias al instante
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Encuentra y reserva tu próximo destino perfecto
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            Miles de hoteles de lujo, mesas exclusivas en los mejores restaurantes y experiencias inolvidables en un solo lugar.
          </p>

          {/* Search Bar Widget */}
          <div className="bg-white text-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl mt-8 max-w-3xl mx-auto border border-white/20">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'hotels' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" /> Hoteles
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'restaurants' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Utensils className="w-4 h-4" /> Restaurantes
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'experiences' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" /> Experiencias & Spas
              </button>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Destino / Zona
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'hotels' ? '¿A qué ciudad viajas?' : activeTab === 'restaurants' ? '¿Qué zona o cocina buscas?' : '¿Qué actividad buscas?'}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> {activeTab === 'hotels' ? 'Fechas de estancia' : 'Fecha y Hora'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> {activeTab === 'hotels' ? 'Huéspedes' : 'Comensales / Personas'}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>1 persona</option>
                  <option>2 personas</option>
                  <option>3 - 4 personas</option>
                  <option>5+ personas (Grupo)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/reservar?category=${activeTab}&destination=${encodeURIComponent(destination)}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-base"
              >
                <Search className="w-5 h-5" /> Buscar Disponibilidad en Tiempo Real
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Explora por Categoría</h2>
            <p className="text-slate-500 text-sm">Todo lo que necesitas para tu escapada o cena especial</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/reservar?category=hotels" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Hoteles & Resorts</h3>
            <p className="text-xs text-slate-500">Alojamientos únicos y con encanto</p>
          </Link>

          <Link href="/reservar?category=restaurants" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500 transition-all flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Restaurantes</h3>
            <p className="text-xs text-slate-500">Mesas y cenas con reserva instantánea</p>
          </Link>

          <Link href="/reservar?category=experiences" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Spas & Bienestar</h3>
            <p className="text-xs text-slate-500">Masajes, circuitos termales y relax</p>
          </Link>

          <Link href="/reservar?category=experiences" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Tours & Actividades</h3>
            <p className="text-xs text-slate-500">Excursiones y visitas guiadas</p>
          </Link>
        </div>
      </section>

      {/* Featured Hotels & Restaurants Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Destacados de la Semana</h2>
            <p className="text-slate-500 text-sm">Los lugares mejor valorados por nuestra comunidad</p>
          </div>
          <Link href="/reservar" className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="relative h-48 bg-slate-200">
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Hotel 5 Estrellas
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 (128)
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-lg">Grand Azure Resort & Spa</h3>
                <p className="text-xs text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Riviera Maya, México
                </p>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-sm text-slate-600">Disfruta de vistas panorámicas al mar Caribe, piscinas infinitas y servicio todo incluido.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Desde</span>
                  <span className="text-lg font-extrabold text-blue-600">$280 <span className="text-xs font-normal text-slate-500">/ noche</span></span>
                </div>
                <Link href="/reservar?category=hotels" className="px-4 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-sm font-semibold rounded-xl transition-colors">
                  Reservar Hotel
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="relative h-48 bg-slate-200">
              <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Restaurante Gourmet
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8 (94)
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-lg">La Cúpula Bistró & Vino</h3>
                <p className="text-xs text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Centro Histórico
                </p>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-sm text-slate-600">Cocina de autor con maridaje exclusivo y terraza romántica bajo las estrellas.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Reserva de mesa</span>
                  <span className="text-lg font-extrabold text-amber-600">Gratis <span className="text-xs font-normal text-slate-500">/ sin comisión</span></span>
                </div>
                <Link href="/reservar?category=restaurants" className="px-4 py-2 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-600 text-sm font-semibold rounded-xl transition-colors">
                  Reservar Mesa
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="relative h-48 bg-slate-200">
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Spa & Bienestar
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 5.0 (62)
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-lg">Zenith Hydrothermal Spa</h3>
                <p className="text-xs text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Zona Financiera
                </p>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-sm text-slate-600">Circuito de hidroterapia completo, masajes relajantes y aromaterapia guiada.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Por sesión</span>
                  <span className="text-lg font-extrabold text-emerald-600">$95 <span className="text-xs font-normal text-slate-500">/ persona</span></span>
                </div>
                <Link href="/reservar?category=experiences" className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 text-sm font-semibold rounded-xl transition-colors">
                  Reservar Spa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
