'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listMyOrdersCSR, type MyOrdersQuery } from '@/services/order.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { MyOrdersList } from '@/typescript/schemas/order.schema';

const EMPTY: MyOrdersList = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 };

/** Owns `GET /profile/orders` — refetches whenever the query changes. */
export function useMyOrders(query: MyOrdersQuery) {
  const [data, setData] = useState<MyOrdersList>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, status, search } = query;

  const fetchOrders = useCallback(async (): Promise<MyOrdersList | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listMyOrdersCSR({ page, limit, status, search });
      setData(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت لیست سفارشات');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return { data, loading, error, refetch: fetchOrders } as const;
}
