'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Spinner } from '@/components/shadcn/spinner';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * CSR guard for authenticated pages.
 *
 * The proxy already rejects requests without a session cookie, but that check
 * is only optimistic (an expired or invalid cookie still passes). This guard
 * waits for `/auth/me` to hydrate the auth store and only renders the protected
 * content once the user is confirmed — so guarded UI never flashes for guests
 * and no authenticated API call fires before the session is known.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isHydrated, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isLoggedIn, router, pathname]);

  if (!isHydrated || !isLoggedIn) {
    return (
      <div className='grid min-h-screen place-content-center bg-gray-1'>
        <Spinner className='size-8 text-primary-1' />
      </div>
    );
  }

  return <>{children}</>;
}
