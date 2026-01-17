import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard
  if (pathname.startsWith('/dashboard') && !sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect if already logged in
  if (pathname.startsWith('/login') && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(sessionId ? '/dashboard' : '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

