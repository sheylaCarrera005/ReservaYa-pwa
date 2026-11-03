import Link from 'next/link';
import { Settings, UserRound } from 'lucide-react';
import { signOut } from '../../app/auth/signin/actions';

export default function AccountMenu({ user, mobile = false }) {
  const menuPosition = mobile
    ? 'absolute bottom-full right-0 mb-3'
    : 'absolute right-0 top-full mt-3';

  return (
    <details className="relative">
      <summary
        aria-label={user ? 'Abrir menú de cuenta' : 'Abrir opciones de acceso'}
        className={`list-none cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 [&::-webkit-details-marker]:hidden ${mobile ? 'h-11 w-11' : 'px-3 py-2'}`}
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
        {!mobile && <span className="text-sm font-semibold">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'Cuenta'}</span>}
      </summary>
      <div className={`${menuPosition} z-[60] w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl`}>
        {user ? (
          <>
            <p className="truncate px-3 py-2 text-xs text-slate-500">Sesión iniciada como<br /><span className="font-semibold text-slate-800">{user.email}</span></p>
            <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Settings className="h-4 w-4" aria-hidden="true" /> Ajustes
            </Link>
            <form action={signOut}>
              <button type="submit" className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Cerrar sesión</button>
            </form>
          </>
        ) : (
          <>
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Accede a tu cuenta</p>
            <Link href="/auth/signin" className="block rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-700">Iniciar sesión con correo</Link>
            <Link href="/auth/register" className="mt-1 block rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50">Crear cuenta</Link>
            <p className="px-3 pb-1 pt-2 text-center text-xs text-slate-400">Otros métodos de acceso, próximamente</p>
          </>
        )}
      </div>
    </details>
  );
}
