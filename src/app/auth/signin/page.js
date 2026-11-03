import Link from 'next/link';
import { signIn } from './actions';

const errorMessages = {
  'missing-fields': 'Introduce tu correo y contraseña.',
  'invalid-credentials': 'No se pudo iniciar sesión. Comprueba tus credenciales.',
  configuration: 'El inicio de sesión no está disponible. Revisa la configuración de Supabase.',
  confirmation: 'No se pudo confirmar el correo. Solicita un nuevo enlace de confirmación.',
};

const statusMessages = {
  'signed-out': 'Has cerrado sesión correctamente.',
  'check-email': 'Cuenta creada. Revisa tu correo y confirma la dirección antes de iniciar sesión.',
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const errorMessage = errorMessages[params?.error];
  const statusMessage = statusMessages[params?.status];

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-slate-900">Iniciar sesión</h1>
          <p className="text-sm text-slate-600">Accede a tu cuenta de ReservaYa.</p>
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        {statusMessage && (
          <p role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </p>
        )}

        <form action={signIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Correo electrónico</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          ¿Aún no tienes cuenta? <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline">Regístrate</Link>
        </p>
        <Link href="/" className="block text-center text-sm font-semibold text-blue-600 hover:underline">Volver al inicio</Link>
      </div>
    </section>
  );
}
