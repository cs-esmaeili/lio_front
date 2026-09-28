'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ordersListAll } from '@/services/order.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export interface OrderOption {
  id: string;
  label: string;
}

export function useOrdersIdList() {
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);

    ordersListAll()
      .then((response) => {
        const mapped = response.items.map((order) => ({ id: order.id, label: `#${order.orderNumber}` }));
        setOrders(mapped);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;

        if (isApiError(error) && error.handled) {
          return;
        }

        const message = getApiErrorMessage(error, 'خطا در دریافت لیست سفارشات.');

        toast.error(message);
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return { orders, loading };
}
