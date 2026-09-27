'use client';

import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';

import { authStore } from '@/stores/authStore';

/**
 * Reads the signed-in user's permissions from the global auth store.
 *
 * Permissions are hydrated once from `GET /auth/me` (see `useAuth`), so the
 * panel can gate any piece of UI with a simple check:
 *
 * ```tsx
 * const { hasPermission } = usePermissions();
 * if (hasPermission('file:manage')) { ... }
 * ```
 */
export function usePermissions() {
  const permissions = useStore(authStore, (state) => state.permissions);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const hasPermission = useCallback((permission: string) => permissionSet.has(permission), [permissionSet]);

  const hasAnyPermission = useCallback(
    (required: string[]) => required.some((permission) => permissionSet.has(permission)),
    [permissionSet],
  );

  const hasAllPermissions = useCallback(
    (required: string[]) => required.every((permission) => permissionSet.has(permission)),
    [permissionSet],
  );

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions } as const;
}
