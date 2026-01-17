'use server'

import db from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { setSessionId, clearSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Missing email or password' };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || user.password !== password) {
      return { error: 'Invalid credentials' };
    }

    await setSessionId(user.id.toString());
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'Missing email or password' };
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: 'User already exists' };
    }

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password,
        name,
      })
      .returning();

    await setSessionId(newUser.id.toString());
  } catch (err) {
    console.error(err);
    return { error: 'Registration failed' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}

