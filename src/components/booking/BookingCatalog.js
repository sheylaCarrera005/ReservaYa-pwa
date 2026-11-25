'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2, Utensils, Compass, Star, MapPin, Calendar, Filter,
  CheckCircle2, ShieldCheck, Clock, Layers, Database,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Todo', Icon: Layers },
  { id: 'hotels', label: 'Alojamientos', Icon: Building2 },
  { id: 'restaurants', label: 'Servicios', Icon: Utensils },
  { id: 'experiences', label: 'Experiencias', Icon: Compass },
];
const TITLES = {
  all: 'Todo',
  hotels: 'Alojamientos',
  restaurants: 'Servicios',
  experiences: 'Experiencias',
};

function CategoryIcon({ category }) {
  const Icon = category === 'hotels' ? Building2 : category === 'restaurants' ? Utensils : Compass;
  return <Icon className="w-12 h-12" />;
}

function ListingImage({ item }) {
  return (
    <div className={`sm:w-48 h-40 rounded-xl ${item.imageBg} flex items-center justify-center relative shrink-0 overflow-hidden`}>
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={`Fotografía de ${item.name}`}
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          className="object-cover"
        />
      )}
      {!item.imageUrl && <CategoryIcon category={item.category} />}
      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
        {item.tag}
      </span>
    </div>
  );
}

export default function BookingCatalog({ items, category, destination, errorMessage }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  function selectItem(item) {
    setSelectedItem(item);
    setBookingConfirmed(false);
  }

  function changeBooking(e) {
    e.preventDefault();
    setBookingConfirmed(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{TITLES[category]}</h1>
          <p className="text-sm text-slate-500">
            {destination ? `Resultados para “${destination}”` : 'Selecciona tu opción favorita para consultar disponibilidad y reservar'}
          </p>
          <p className="text-xs text-emerald-700 flex items-center gap-1.5 mt-2 font-medium">
            <Database className="w-3.5 h-3.5" /> Catálogo en vivo desde Supabase
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map(({ id, label, Icon }) => (
            <Link
              key={id}
              href={`/reservar?category=${id}`}
              onClick={() => selectItem(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${category === id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-sm text-slate-500 px-1">
            <span>{errorMessage ? 'Catálogo no disponible' : `${items.length} ${items.length === 1 ? 'resultado' : 'resultados'} de Supabase`}</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Filter className="w-4 h-4" /> Recomendados
            </span>
          </div>

          {errorMessage && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {!errorMessage && items.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h2 className="font-bold text-slate-800">No encontramos opciones</h2>
              <p className="text-sm text-slate-500 mt-2">Prueba otro destino o consulta todas las categorías.</p>
              <Link href="/reservar?category=all" className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:underline">
                Ver todo el catálogo
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item)}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col sm:flex-row gap-5 cursor-pointer shadow-sm hover:shadow-md ${selectedItem?.id === item.id ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <ListingImage item={item} />
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-200/50 whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating} ({item.reviews})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.location}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block">{item.offerName}</span>
                      <span className="text-base font-extrabold text-blue-600">{item.price}</span>
                    </div>
                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20">
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                    <h4 className="font-extrabold text-xl text-slate-900">¡Simulación completada!</h4>
                    <p className="text-sm text-slate-600">
                      Esta es una vista previa para <span className="font-bold text-slate-900">{selectedItem.name}</span>. No se guardó ninguna reserva.
                    </p>
                  </div>
                  <button onClick={() => setBookingConfirmed(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                    Hacer otra simulación
                  </button>
                </div>
              ) : (
                <form onSubmit={changeBooking} className="space-y-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedItem.tag}</span>
                    <h4 className="font-bold text-slate-900 text-base">{selectedItem.name}</h4>
                    <p className="text-xs text-slate-500">{selectedItem.offerName} · {selectedItem.location}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label htmlFor="booking-date" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Fecha seleccionada</label>
                      <input id="booking-date" type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                      <label htmlFor="booking-people" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Personas (máximo {selectedItem.capacity})</label>
                      <select id="booking-people" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                        {Array.from({ length: Math.min(selectedItem.capacity, 8) }, (_, index) => (
                          <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? 'persona' : 'personas'}</option>
                        ))}
                      </select>
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

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Simular Reserva
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    No se guardará la reserva ni se realizará ningún cargo.
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
                  Selecciona un establecimiento del catálogo para ver los detalles y simular una reserva.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
