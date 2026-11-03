import Link from 'next/link';
import { signUp } from '../signin/actions';

const errorMessages = {
  'missing-fields': 'Completa todos los campos.',
  'invalid-input': 'El nombre no puede superar 80 caracteres y la contraseña debe tener al menos 8.',
  'password-mismatch': 'Las contraseñas no coinciden.',
  'registration-failed': 'No se pudo crear la cuenta. Verifica los datos o intenta iniciar sesión si ya tienes una cuenta.',
  configuration: 'El registro no está disponible. Revisa la configuración de Supabase.',
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const errorMessage = errorMessages[params?.error];

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-slate-900">Crear cuenta</h1>
          <p className="text-sm text-slate-600">Regístrate para empezar a explorar ReservaYa.</p>
        </div>
        {errorMessage && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
        <form action={signUp} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
            <input id="name" name="name" type="text" autoComplete="name" maxLength={80} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Correo electrónico</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-semibold text-slate-700 mb-1">Confirmar contraseña</label>
            <input id="passwordConfirmation" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Crear cuenta</button>
        </form>
        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link href="/auth/signin" className="font-semibold text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
