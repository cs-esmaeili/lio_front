'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getMyOrderSummaryCSR } from '@/services/order.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { MyOrderSummary } from '@/typescript/schemas/order.schema';

const EMPTY: MyOrderSummary = { total: 0, items: [] };

/** Owns `GET /profile/orders/summary` for the dashboard order cards. */
export function useMyOrderSummary() {
  const [summary, setSummary] = useState<MyOrderSummary>(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async (): Promise<MyOrderSummary | null> => {
    try {
      const result = await getMyOrderSummaryCSR();
      setSummary(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        return null;
      }

      toast.error(getApiErrorMessage(requestError, 'خطا در دریافت خلاصه سفارشات'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, refetch: fetchSummary } as const;
}
