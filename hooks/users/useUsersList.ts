'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listUsersCSR, type AdminUserListQuery } from '@/services/adminUsers.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminUserListResponse } from '@/typescript/schemas/admin-user.schema';

const EMPTY: AdminUserListResponse = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 };

/** Owns `GET /admin/users` — refetches whenever the query changes. */
export function useUsersList(query: AdminUserListQuery, enabled = true) {
  const [data, setData] = useState<AdminUserListResponse>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search, status, roleId } = query;

  const fetchUsers = useCallback(async (): Promise<AdminUserListResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listUsersCSR({ page, limit, search, status, roleId });
      setData(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت کاربران');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, roleId]);

  useEffect(() => {
    if (!enabled) return;
    void fetchUsers();
  }, [enabled, fetchUsers]);

  return { data, loading, error, refetch: fetchUsers } as const;
}
