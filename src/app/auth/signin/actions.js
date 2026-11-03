'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export async function signIn(formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    redirect('/auth/signin?error=missing-fields');
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect('/auth/signin?error=invalid-credentials');
    }
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    redirect('/auth/signin?error=configuration');
  }

  redirect('/');
}

export async function signUp(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const passwordConfirmation = String(formData.get('passwordConfirmation') || '');

  if (!name || !email || !password || !passwordConfirmation) {
    redirect('/auth/register?error=missing-fields');
  }
  if (name.length > 80 || password.length < 8) {
    redirect('/auth/register?error=invalid-input');
  }
  if (password !== passwordConfirmation) {
    redirect('/auth/register?error=password-mismatch');
  }

  try {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${siteUrl}/auth/callback?next=/`,
      },
    });

    if (error) {
      console.error('[Supabase registration error]', error.code, error.message);
      redirect('/auth/register?error=registration-failed');
    }
    if (data.session) redirect('/');
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    redirect('/auth/register?error=configuration');
  }

  redirect('/auth/signin?status=check-email');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/signin?status=signed-out');
}
