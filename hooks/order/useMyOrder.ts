'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getMyOrderCSR } from '@/services/order.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { Order } from '@/typescript/schemas/order.schema';

/** Owns `GET /profile/orders/{orderNumber}`. */
export function useMyOrder(orderNumber: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));

  const fetchOrder = useCallback(async (): Promise<Order | null> => {
    if (!orderNumber) return null;

    setLoading(true);
    try {
      const result = await getMyOrderCSR(orderNumber);
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
  }, [orderNumber]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  return { order, loading, refetch: fetchOrder } as const;
}
