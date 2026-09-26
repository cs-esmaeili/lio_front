import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { lookupRedirect } from '@/services/redirect.service';

const protectedPaths = ['/dashboard' , '/checkout'];
const authPaths = ['/login'];

/** HttpOnly session cookie set by the backend (`__Host-session` when Secure). */
function hasSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get('__Host-session')?.value || request.cookies.get('session')?.value,
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO Redirects
  const redirect = await lookupRedirect(pathname);
  if (redirect) {
    return NextResponse.redirect(new URL(redirect.to_url, request.url), redirect.code);
  }

  // Authentication
  const session = hasSession(request);

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && session) {
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/dashboard';
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
};
