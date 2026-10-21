'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Building2, Utensils, Compass, Star, MapPin, Calendar, Users, Filter, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

function ReservarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'hotels';

  const [category, setCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Sync category state when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Mock data for items based on category
  const mockItems = {
    hotels: [
      { id: 1, name: 'Grand Azure Resort & Spa', location: 'Riviera Maya, México', rating: 4.9, reviews: 128, price: '$280 / noche', imageBg: 'bg-blue-100', tag: 'Todo Incluido', desc: 'Resort de lujo frente al mar con piscinas infinitas y spa.' },
      { id: 2, name: 'Hotel Boutique Altamira', location: 'Centro Histórico', rating: 4.7, reviews: 85, price: '$150 / noche', imageBg: 'bg-blue-50', tag: 'Boutique', desc: 'Arquitectura colonial restaurada con diseño moderno y terraza panorámica.' },
      { id: 3, name: 'Alpine Lodge & Ski Resort', location: 'Montaña Nevada', rating: 4.8, reviews: 110, price: '$320 / noche', imageBg: 'bg-indigo-100', tag: 'Montaña', desc: 'Acogedor refugio con chimenea, acceso directo a pistas y jacuzzi exterior.' },
    ],
    restaurants: [
      { id: 4, name: 'La Cúpula Bistró & Vino', location: 'Zona Gourmet', rating: 4.8, reviews: 94, price: 'Reserva gratis', imageBg: 'bg-amber-100', tag: 'Alta Cocina', desc: 'Cocina de autor con maridaje exclusivo y terraza romántica.' },
      { id: 5, name: 'Sakura Sushi & Robata', location: 'Distrito Financiero', rating: 4.9, reviews: 156, price: 'Reserva gratis', imageBg: 'bg-amber-50', tag: 'Japonesa', desc: 'Barra de sushi omakase y parrilla robata tradicional japonesa.' },
      { id: 6, name: 'Trattoria del Nonna', location: 'Little Italy', rating: 4.6, reviews: 78, price: 'Reserva gratis', imageBg: 'bg-orange-100', tag: 'Italiana', desc: 'Pastas artesanales hechas a mano y hornos de leña tradicionales.' },
    ],
    experiences: [
      { id: 7, name: 'Zenith Hydrothermal Spa', location: 'Zona Financiera', rating: 5.0, reviews: 62, price: '$95 / sesión', imageBg: 'bg-emerald-100', tag: 'Bienestar', desc: 'Circuito completo de hidroterapia, sauna finlandesa y masajes relajantes.' },
      { id: 8, name: 'Tour Gastronómico Nocturno', location: 'Casco Antiguo', rating: 4.9, reviews: 210, price: '$65 / persona', imageBg: 'bg-emerald-50', tag: 'Tour Guiado', desc: 'Recorrido por 5 paradas gastronómicas con degustación de vinos y tapas.' },
    ]
  };

  const currentList = mockItems[category] || mockItems.hotels;

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {category === 'hotels' ? 'Hoteles y Alojamientos' : category === 'restaurants' ? 'Mesas en Restaurantes' : 'Experiencias y Spas'}
          </h1>
          <p className="text-sm text-slate-500">Selecciona tu opción favorita para consultar disponibilidad y reservar</p>
        </div>

        {/* Category switcher pills */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => { setCategory('hotels'); setSelectedItem(null); setBookingConfirmed(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              category === 'hotels' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Hoteles
          </button>
          <button
            onClick={() => { setCategory('restaurants'); setSelectedItem(null); setBookingConfirmed(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              category === 'restaurants' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" /> Restaurantes
          </button>
          <button
            onClick={() => { setCategory('experiences'); setSelectedItem(null); setBookingConfirmed(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              category === 'experiences' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" /> Experiencias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-sm text-slate-500 px-1">
            <span>Mostrando {currentList.length} resultados disponibles</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Filter className="w-4 h-4" /> Ordenar por: Recomendados
            </span>
          </div>

          <div className="space-y-4">
            {currentList.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelectedItem(item); setBookingConfirmed(false); }}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col sm:flex-row gap-5 cursor-pointer shadow-sm hover:shadow-md ${
                  selectedItem?.id === item.id ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`sm:w-48 h-40 rounded-xl ${item.imageBg} flex items-center justify-center relative shrink-0`}>
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {item.tag}
                  </span>
                  {category === 'hotels' ? <Building2 className="w-12 h-12 text-blue-400" /> : category === 'restaurants' ? <Utensils className="w-12 h-12 text-amber-400" /> : <Compass className="w-12 h-12 text-emerald-400" />}
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-200/50">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating} ({item.reviews})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.location}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block">Precio / Tarifa</span>
                      <span className="text-base font-extrabold text-blue-600">{item.price}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20">
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details / Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Resumen de Reserva
            </h3>

            {selectedItem ? (
              bookingConfirmed ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-xl text-slate-900">¡Reserva Simulada con Éxito!</h4>
                    <p className="text-sm text-slate-600">
                      Hemos registrado tu solicitud para <span className="font-bold text-slate-900">{selectedItem.name}</span>. Recibirás la confirmación en tu dispositivo PWA.
                    </p>
                  </div>
                  <button
                    onClick={() => setBookingConfirmed(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    Hacer otra reserva
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedItem.tag}</span>
                    <h4 className="font-bold text-slate-900 text-base">{selectedItem.name}</h4>
                    <p className="text-xs text-slate-500">{selectedItem.location}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Fecha seleccionada</label>
                      <input
                        type="date"
                        required
                        defaultValue="2026-11-15"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        {category === 'hotels' ? 'Número de noches / Huéspedes' : 'Hora y comensales'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                          <option>2 noches</option>
                          <option>1 noche</option>
                          <option>3 noches</option>
                        </select>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                          <option>2 personas</option>
                          <option>1 persona</option>
                          <option>4 personas</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Tarifa base</span>
                        <span className="font-semibold">{selectedItem.price}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Impuestos y tasas</span>
                        <span className="font-semibold">Incluido</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200">
                        <span>Total estimado</span>
                        <span className="text-blue-600">{selectedItem.price}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" /> Confirmar Reserva (Simulación)
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    No se realizará ningún cargo en esta fase de diseño de vistas.
                  </p>
                </form>
              )
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-600">Ningún lugar seleccionado</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Haz clic en cualquier hotel o restaurante de la lista para ver los detalles y simular tu reserva.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservarPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Cargando vistas de reserva...</div>}>
      <ReservarContent />
    </Suspense>
  );
}
