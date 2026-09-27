'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listPermissionsCSR } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminPermission } from '@/typescript/schemas/admin-authorization.schema';

/** Owns `GET /admin/permissions`. */
export function usePermissionsList(enabled = true) {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async (): Promise<AdminPermission[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listPermissionsCSR();
      setPermissions(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت دسترسی‌ها');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchPermissions();
  }, [enabled, fetchPermissions]);

  return { permissions, loading, error, refetch: fetchPermissions } as const;
}
