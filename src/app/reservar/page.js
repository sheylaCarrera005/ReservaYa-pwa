'use client';
import { useState } from 'react';

export default function ReservarPage() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fecha && hora) {
      setConfirmado(true);
    }
  };

  return (
    <section>
      <h2>Agendar tu Cita</h2>
      {confirmado ? (
        <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px' }}>
          <h3>¡Reserva Confirmada!</h3>
          <p>Tu cita quedó agendada para el <strong>{fecha}</strong> a las <strong>{hora}</strong>.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <label>
            Fecha:
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <label>
            Hora:
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <button type="submit" style={{ padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Confirmar Reserva
          </button>
        </form>
      )}
    </section>
  );
}
