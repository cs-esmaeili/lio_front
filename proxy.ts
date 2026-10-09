import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { lookupRedirect } from '@/services/redirect.service';
import { safeReturnUrl } from '@/utils/path';

const protectedPaths = ['/dashboard', '/checkout'];
const authPaths = ['/login'];
const adminPaths = ['/admin'];

/** HttpOnly session cookie set by the backend (`__Host-session` when Secure). */
function hasSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get('__Host-session')?.value || request.cookies.get('session')?.value,
  );
}

/** Matches a path exactly, or as a parent segment (`/admin` → `/admin/...`). */
function isUnder(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Optimistic admin-panel check: asks the backend whether the session user may
 * view the panel (`admin:panel:view`). Permissions live in the DB, so the
 * session cookie alone is not enough.
 *
 * Returns `null` when the check could not be performed (backend unreachable) —
 * the request is then allowed through and the CSR `AdminGuard` plus the
 * permission-guarded APIs remain the real enforcement.
 */
async function canViewAdminPanel(request: NextRequest): Promise<boolean | null> {
  const backend = process.env.BACKEND_ENDPOINT_SSR ?? process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT;
  if (!backend) return null;

  try {
    const response = await fetch(`${backend}/auth/me`, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const body = (await response.json()) as { data?: { authenticated?: boolean; showAdminPanel?: boolean } };
    if (!body?.data?.authenticated) return false;

    return Boolean(body.data.showAdminPanel);
  } catch {
    return null;
  }
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

  // Admin panel: session + admin-panel access.
  if (isUnder(pathname, adminPaths)) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const canViewPanel = await canViewAdminPanel(request);
    if (canViewPanel === false) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  if (isUnder(pathname, protectedPaths) && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isUnder(pathname, authPaths) && session) {
    const returnUrl = safeReturnUrl(request.nextUrl.searchParams.get('returnUrl'));
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
};
