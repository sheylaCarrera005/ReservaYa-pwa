import HomeContent from './HomeContent';
import { createClient } from '../lib/supabase/server';

export default async function HomePage() {
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // The home page remains available without Supabase configuration.
  }

  const name = user
    ? user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.given_name || user.email?.split('@')[0]
    : null;

  return (
    <>
      <HomeContent />
    </>
  );
}
