import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect('/auth/signin');

  const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Usuario de ReservaYa';

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Ajustes</h1>
        <p className="mt-2 text-slate-600">Administra la información de tu cuenta.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Tu cuenta</h2>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</p>
          <p className="mt-1 text-slate-800">{name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo electrónico</p>
          <p className="mt-1 text-slate-800">{data.user.email}</p>
        </div>
        <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">Más opciones de cuenta estarán disponibles próximamente.</p>
      </div>
    </section>
  );
}
