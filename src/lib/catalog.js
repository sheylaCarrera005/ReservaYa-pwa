import { createClient } from './supabase/server';

const CATEGORIES = ['hotels', 'restaurants', 'experiences'];
const CATEGORY_STYLES = {
  hotels: 'bg-blue-100 text-blue-400',
  restaurants: 'bg-amber-100 text-amber-400',
  experiences: 'bg-emerald-100 text-emerald-400',
};
const PRICE_LABELS = {
  night: 'noche',
  person: 'persona',
};

export async function getCatalogItems(category, destination = '') {
  const supabase = await createClient();
  let query = supabase
    .from('establishments')
    .select(`
      id, name, description, location, city, category, image_url, tags,
      rating_average, review_count,
      bookable_items!inner (
        id, name, unit_price, currency, pricing_unit, capacity, duration_minutes
      )
    `)
    .eq('is_active', true)
    .eq('bookable_items.is_active', true)
    .order('rating_average', { ascending: false })
    .order('name');

  if (CATEGORIES.includes(category)) {
    query = query.eq('category', category);
  }

  const search = destination.trim().slice(0, 100);
  if (search) {
    const pattern = `%${search.replaceAll(',', ' ').replaceAll('%', '').replaceAll('*', '')}%`;
    query = query.or(`location.ilike.${pattern},city.ilike.${pattern},name.ilike.${pattern}`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((establishment) => {
    const item = establishment.bookable_items[0];
    const price = Number(item.unit_price);
    const priceLabel = price === 0
      ? 'Reserva gratis'
      : `${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: item.currency,
          maximumFractionDigits: 2,
        }).format(price)} / ${PRICE_LABELS[item.pricing_unit] || 'reserva'}`;

    return {
      id: item.id,
      establishmentId: establishment.id,
      category: establishment.category,
      name: establishment.name,
      desc: establishment.description,
      offerName: item.name,
      location: establishment.location || establishment.city,
      rating: Number(establishment.rating_average).toFixed(1),
      reviews: establishment.review_count,
      imageUrl: establishment.image_url,
      imageBg: CATEGORY_STYLES[establishment.category],
      tag: establishment.tags?.[0] || item.name,
      price: priceLabel,
      capacity: item.capacity,
      durationMinutes: item.duration_minutes,
    };
  });
}
