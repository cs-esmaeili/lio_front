'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listOrdersCSR, type AdminOrdersQuery } from '@/services/adminOrders.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminOrdersList } from '@/typescript/schemas/order.schema';

const EMPTY: AdminOrdersList = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 };

/** Owns `GET /admin/orders` — refetches whenever the query changes. */
export function useAdminOrders(query: AdminOrdersQuery, enabled = true) {
  const [data, setData] = useState<AdminOrdersList>(EMPTY);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, status, search, userId } = query;

  const fetchOrders = useCallback(async (): Promise<AdminOrdersList | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listOrdersCSR({ page, limit, status, search, userId });
      setData(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت سفارشات');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search, userId]);

  useEffect(() => {
    if (!enabled) return;
    void fetchOrders();
  }, [enabled, fetchOrders]);

  return { data, loading, error, refetch: fetchOrders } as const;
}
