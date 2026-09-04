'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ordersListAll } from '@/services/order.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

// import type { Order } from '@/components/dashboard/order/order.model';

export interface Order {
  id: number;
  label: string;
}

export function useOrdersIdList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);

    ordersListAll()
      .then((response) => {
        const orders =
            response.data?.data?.orders?.map((order: any) => ({
            id: order.id,
            label: `#${order.code}`,
            })) ?? [];

        setOrders(orders);
        })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;

        if (isApiError(error) && error.handled) {
          return;
        }

        const message = getApiErrorMessage(error, 'خطا در دریافت لیست بخش‌ها.');

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