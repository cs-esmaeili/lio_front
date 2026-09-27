'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Spinner } from '@/components/shadcn/spinner';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * CSR guard for the admin panel.
 *
 * The proxy already rejects requests without a session or without
 * `showAdminPanel`, but that check is only optimistic. This guard is the
 * client-side source of truth: it waits for `/auth/me` to hydrate the auth
 * store (user + permissions + `showAdminPanel`) and only then renders the
 * panel, so permission-gated UI never flashes for unauthorized users.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isHydrated, isLoggedIn, showAdminPanel } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!showAdminPanel) {
      router.replace('/dashboard');
    }
  }, [isHydrated, isLoggedIn, showAdminPanel, router, pathname]);

  const authorized = isHydrated && isLoggedIn && showAdminPanel;

  if (!authorized) {
    return (
      <div className='grid min-h-screen place-content-center bg-gray-1'>
        <Spinner className='size-8 text-primary-1' />
      </div>
    );
  }

  return <>{children}</>;
}
