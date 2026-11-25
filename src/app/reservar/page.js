import { Suspense } from 'react';
import BookingCatalog from '../../components/booking/BookingCatalog';
import { getCatalogItems } from '../../lib/catalog';

const CATEGORIES = ['all', 'hotels', 'restaurants', 'experiences'];

async function CatalogResults({ category, destination }) {
  let items;
  let errorMessage = null;

  try {
    items = await getCatalogItems(category, destination);
  } catch (error) {
    console.error('[Catálogo de Supabase]', error.message);
    items = [];
    errorMessage = 'No pudimos cargar el catálogo. Inténtalo de nuevo en unos momentos.';
  }

  return (
    <BookingCatalog
      items={items}
      category={category}
      destination={destination}
      errorMessage={errorMessage}
    />
  );
}

export default async function ReservarPage({ searchParams }) {
  const params = await searchParams;
  const category = CATEGORIES.includes(params?.category) ? params.category : 'hotels';
  const destination = params?.destination || '';

  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Cargando catálogo de Supabase...</div>}>
      <CatalogResults category={category} destination={destination} />
    </Suspense>
  );
}
