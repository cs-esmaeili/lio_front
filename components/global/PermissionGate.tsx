'use client';

import { ShieldOff } from 'lucide-react';
import type { ReactNode } from 'react';

import { Spinner } from '@/components/shadcn/spinner';
import { useAuth } from '@/hooks/auth/useAuth';

interface PermissionGateProps {
  /** Require at least one of these permissions. */
  anyOf?: string[];
  /** Require all of these permissions. */
  allOf?: string[];
  /** Shown when the user lacks access. Defaults to a no-access panel. */
  fallback?: ReactNode;
  children: ReactNode;
}

function NoAccess() {
  return (
    <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
      <ShieldOff className='text-custom-red' size={36} aria-hidden='true' />
      <p className='text-regular text-secondary-1'>شما دسترسی لازم برای مشاهده این بخش را ندارید.</p>
    </div>
  );
}

/**
 * Renders its children only when the signed-in user has the required
 * permission(s), read from the global auth store (`GET /auth/me`). It waits for
 * the store to hydrate first so guarded UI never flashes for an unauthorized
 * user.
 */
export default function PermissionGate({ anyOf, allOf, fallback, children }: PermissionGateProps) {
  const { isHydrated, hasAnyPermission, hasAllPermissions } = useAuth();

  if (!isHydrated) {
    return (
      <div className='grid min-h-[40vh] place-content-center'>
        <Spinner className='size-8 text-primary-1' />
      </div>
    );
  }

  const allowed = (!anyOf?.length || hasAnyPermission(anyOf)) && (!allOf?.length || hasAllPermissions(allOf));

  if (!allowed) return <>{fallback ?? <NoAccess />}</>;

  return <>{children}</>;
}
