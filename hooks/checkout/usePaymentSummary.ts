'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { payment } from '@/services/checkout.service';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { PaymentResponse } from '@/typescript/types/checkout.types';

const NAME_FAMILY_REQUIRED_MESSAGE = 'نام و نام خانوادگی در آدرس اجباری می‌باشد.';

/**
 * Pure API hook. No step management, no useEffect.
 * refetch(params) calls /payment and writes cart + card data to store.
 * Returns the response body so the stepper can check success/failure.
 */
export function usePaymentSummary() {
  const setPaymentData = useCheckoutStore((s) => s.setPaymentData);
  const setPaymentSummaryLoading = useCheckoutStore((s) => s.setPaymentSummaryLoading);
  const setCardMethodsData = useCheckoutStore((s) => s.setCardMethodsData);
  const setPercentageCard = useCheckoutStore((s) => s.setPercentageCard);

  const [paymentErrorAddressId, setPaymentErrorAddressId] = useState<number | undefined>();

  const clearPaymentError = useCallback(() => setPaymentErrorAddressId(undefined), []);

  const refetch = useCallback(async (
    shippingMethodId: number,
    addressId: number,
    walletId: number,
    paymentMethodId?: number,
  ): Promise<PaymentResponse | null> => {
    setPaymentSummaryLoading(true);

    try {
      const res = await payment(shippingMethodId, addressId, walletId, '', paymentMethodId);
      const body: PaymentResponse = res.data.data;

      setPaymentData(body.cart);
      setCardMethodsData(body.card_methods ?? false, body.payment_methods_data ?? []);

      const pct = (body as any).percentage_card ?? (body.cart as any)?.percentage_card ?? null;
      setPercentageCard(pct);

      if (pct != null && paymentMethodId === 0) {
        toast.success(`سود شما از کارت به کارت: ${pct}%`);
      }

      setPaymentErrorAddressId(undefined);
      return body;
    } catch (error) {
      if (
        isApiError(error) &&
        error.status === 400 &&
        error.message === NAME_FAMILY_REQUIRED_MESSAGE
      ) {
        setPaymentErrorAddressId(addressId);
      }

      if (!isApiError(error) || !error.handled) {
        toast.error(getApiErrorMessage(error, 'خطا در دریافت اطلاعات سفارش'));
      }
      return null;
    } finally {
      setPaymentSummaryLoading(false);
    }
  }, [setPaymentData, setPaymentSummaryLoading, setCardMethodsData, setPercentageCard]);

  return { paymentErrorAddressId, clearPaymentError, refetch };
}
