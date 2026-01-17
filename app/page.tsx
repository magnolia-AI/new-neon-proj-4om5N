import { getSessionId } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const sessionId = await getSessionId();

  if (sessionId) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

