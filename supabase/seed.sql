-- Datos de demostración alineados con src/app/reservar/page.js.
-- No se crean usuarios, reservas ni reseñas ficticias.

insert into public.establishments (
  id, category, slug, name, description, location, city, country_code,
  image_url, tags, rating_average, review_count
)
values
  ('20000000-0000-4000-8000-000000000001', 'hotels', 'grand-azure-resort-spa',
   'Grand Azure Resort & Spa', 'Resort de lujo frente al mar con piscinas infinitas y spa.',
   'Riviera Maya, México', 'Riviera Maya', 'MX', null, '{Todo Incluido}', 4.9, 128),
  ('20000000-0000-4000-8000-000000000002', 'hotels', 'hotel-boutique-altamira',
   'Hotel Boutique Altamira', 'Arquitectura colonial restaurada con diseño moderno y terraza panorámica.',
   'Centro Histórico', 'Ciudad de México', 'MX', null, '{Boutique}', 4.7, 85),
  ('20000000-0000-4000-8000-000000000003', 'hotels', 'alpine-lodge-ski-resort',
   'Alpine Lodge & Ski Resort', 'Acogedor refugio con chimenea, acceso directo a pistas y jacuzzi exterior.',
   'Montaña Nevada', 'Montaña Nevada', 'MX', null, '{Montaña}', 4.8, 110),
  ('20000000-0000-4000-8000-000000000004', 'restaurants', 'la-cupula-bistro-vino',
   'La Cúpula Bistró & Vino', 'Cocina de autor con maridaje exclusivo y terraza romántica.',
   'Zona Gourmet', 'Ciudad de México', 'MX', null, '{Alta Cocina}', 4.8, 94),
  ('20000000-0000-4000-8000-000000000005', 'restaurants', 'sakura-sushi-robata',
   'Sakura Sushi & Robata', 'Barra de sushi omakase y parrilla robata tradicional japonesa.',
   'Distrito Financiero', 'Ciudad de México', 'MX', null, '{Japonesa}', 4.9, 156),
  ('20000000-0000-4000-8000-000000000006', 'restaurants', 'trattoria-del-nonna',
   'Trattoria del Nonna', 'Pastas artesanales hechas a mano y hornos de leña tradicionales.',
   'Little Italy', 'Ciudad de México', 'MX', null, '{Italiana}', 4.6, 78),
  ('20000000-0000-4000-8000-000000000007', 'experiences', 'zenith-hydrothermal-spa',
   'Zenith Hydrothermal Spa', 'Circuito completo de hidroterapia, sauna finlandesa y masajes relajantes.',
   'Zona Financiera', 'Ciudad de México', 'MX', null, '{Bienestar}', 5.0, 62),
  ('20000000-0000-4000-8000-000000000008', 'experiences', 'tour-gastronomico-nocturno',
   'Tour Gastronómico Nocturno', 'Recorrido por 5 paradas gastronómicas con degustación de vinos y tapas.',
   'Casco Antiguo', 'Ciudad de México', 'MX', null, '{Tour Guiado}', 4.9, 210)
on conflict (id) do nothing;

insert into public.bookable_items (
  id, establishment_id, name, description, capacity, duration_minutes,
  unit_price, currency, pricing_unit, check_in_time, check_out_time
)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
   'Estancia Grand Azure', 'Habitación doble con acceso a las instalaciones del resort.',
   4, 1440, 280.00, 'USD', 'night', '15:00', '12:00'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002',
   'Estancia Boutique', 'Habitación doble con diseño contemporáneo.',
   2, 1440, 150.00, 'USD', 'night', '15:00', '12:00'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003',
   'Estancia Alpine', 'Habitación doble con acceso al jacuzzi exterior.',
   4, 1440, 320.00, 'USD', 'night', '16:00', '11:00'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004',
   'Mesa para cuatro', 'Reserva de mesa sin cargo ni comisión.',
   4, 120, 0.00, 'USD', 'booking', null, null),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005',
   'Mesa para cuatro', 'Reserva de mesa sin cargo ni comisión.',
   4, 120, 0.00, 'USD', 'booking', null, null),
  ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006',
   'Mesa para cuatro', 'Reserva de mesa sin cargo ni comisión.',
   4, 120, 0.00, 'USD', 'booking', null, null),
  ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000007',
   'Circuito hidrotermal', 'Sesión de 90 minutos por persona.',
   6, 90, 95.00, 'USD', 'person', null, null),
  ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000008',
   'Tour gastronómico', 'Recorrido guiado de tres horas por persona.',
   12, 180, 65.00, 'USD', 'person', null, null)
on conflict (id) do nothing;

insert into public.availability_rules (
  bookable_item_id, day_of_week, start_time, end_time
)
select
  b.id,
  days.day_of_week,
  case e.category when 'restaurants' then '12:00'::time else '09:00'::time end,
  case e.category when 'restaurants' then '23:00'::time else '20:00'::time end
from public.bookable_items b
join public.establishments e on e.id = b.establishment_id
cross join generate_series(0, 6) as days(day_of_week)
on conflict do nothing;
