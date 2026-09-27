'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listRolesCSR } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

/** Owns `GET /admin/roles`. */
export function useRolesList(enabled = true) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async (): Promise<AdminRole[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listRolesCSR();
      setRoles(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت نقش‌ها');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchRoles();
  }, [enabled, fetchRoles]);

  return { roles, loading, error, refetch: fetchRoles } as const;
}
