'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { paymentFinal } from '@/services/checkout.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/**
 * Pure API hook. No step management.
 * execute(params) calls /payment/pay, navigates on success.
 * Returns redirectRoute string so the stepper knows what happened.
 */
export function usePaymentFinal() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const execute = useCallback(
    async (
      shippingMethodId: number,
      addressId: number,
      paymentMethodId: number,
      walletId: number,
      couponCode: string,
      transactionFile?: File,
    ): Promise<string | null> => {
      setLoading(true);
      try {
        const res = await paymentFinal(shippingMethodId, addressId, paymentMethodId, walletId, couponCode, transactionFile);

        const redirectRoute: string | undefined = res.data?.data?.redirect_route ?? res.data?.redirect_route;

        if (redirectRoute) {
          router.push(redirectRoute);
          return redirectRoute;
        }

        toast.error('مسیر پرداخت یافت نشد');
        setLoading(false);
        return null;
      } catch (error) {
        setLoading(false);
        if (!isApiError(error) || !error.handled) {
          toast.error(getApiErrorMessage(error, 'خطا در اتصال به درگاه پرداخت'));
        }
        return null;
      }
    },
    [router],
  );

  return { loading, execute };
}
