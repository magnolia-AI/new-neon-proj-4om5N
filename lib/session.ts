import { cookies } from 'next/headers';

export async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get('session_id')?.value;
}

export async function setSessionId(id: string) {
  const cookieStore = await cookies();
  cookieStore.set('session_id', id, {
    httpOnly: true,
    secure: process.env.NODE_NODE === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session_id');
}

