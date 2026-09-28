'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getOrderCSR } from '@/services/adminOrders.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { Order } from '@/typescript/schemas/order.schema';

/** Owns `GET /admin/orders/{id}`. */
export function useAdminOrder(id: number | undefined, enabled = true) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(id !== undefined && enabled);

  const fetchOrder = useCallback(async (): Promise<Order | null> => {
    if (id === undefined) return null;

    setLoading(true);
    try {
      const result = await getOrderCSR(id);
      setOrder(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setOrder(null);
        return null;
      }

      toast.error(getApiErrorMessage(requestError, 'دریافت اطلاعات سفارش با خطا مواجه شد.'));
      setOrder(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!enabled) return;
    void fetchOrder();
  }, [enabled, fetchOrder]);

  return { order, loading, refetch: fetchOrder } as const;
}
