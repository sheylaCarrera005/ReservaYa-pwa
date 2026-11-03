import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export default async function AuthLayout({ children }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!error && data.user) {
      redirect('/');
    }
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    // Keep auth pages accessible when Supabase is not configured or unavailable.
  }

  return children;
}
