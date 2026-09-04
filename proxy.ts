import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { lookupRedirect } from '@/services/redirect.service';

const protectedPaths = ['/dashboard' , '/checkout'];
const authPaths = ['/login'];

const SESSION_MAX_AGE =
  Number(process.env.NEXT_PUBLIC_SESSION_MAX_AGE) || 7200;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO Redirects
  const redirect = await lookupRedirect(pathname);
  if (redirect) {
    return NextResponse.redirect(new URL(redirect.to_url, request.url), redirect.code);
  }

  // Authentication
  const token = request.cookies.get('auth_token')?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/dashboard';
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  const response = NextResponse.next();

  // Refresh session cookie on every request (covers both SSR page loads and client API calls)
  if (token) {
    response.cookies.set('auth_token', token, {
      path: '/',
      maxAge: SESSION_MAX_AGE,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
};