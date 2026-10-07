export default function HomePage() {
  const servicios = [
    { id: 1, nombre: 'Corte de Cabello y Barba', precio: '$250', duracion: '45 min' },
    { id: 2, nombre: 'Consulta Médica General', precio: '$500', duracion: '30 min' },
    { id: 3, nombre: 'Reserva de Mesa Restaurante', precio: 'Gratis', duracion: '2 hrs' },
  ];

  return (
    <section>
      <h2>Servicios Disponibles</h2>
      <p>Selecciona un servicio para agendar tu cita de forma inmediata:</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {servicios.map((s) => (
          <div key={s.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{s.nombre}</h3>
            <p><strong>Precio:</strong> {s.precio} | <strong>Duración:</strong> {s.duracion}</p>
            <a href="/reservar" style={{ color: '#2563eb', fontWeight: 'bold' }}>Agendar Cita →</a>
          </div>
        ))}
      </div>
    </section>
  );
}
