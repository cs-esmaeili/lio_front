'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { payment } from '@/services/checkout.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

export function usePayment() {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (shippingMethodId: number, addressId: number, walletId: number, code: string) => {
      setLoading(true);
      try {
        const res = await payment(shippingMethodId, addressId, walletId, code);
        return res.data;
      } catch (error) {
        if (!isApiError(error) || !error.handled) {
          toast.error(getApiErrorMessage(error, 'خطا در پرداخت'));
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, execute };
}
