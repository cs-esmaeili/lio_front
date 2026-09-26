'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isHydrated, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isLoggedIn, router, pathname]);

  return <>{children}</>;
}
