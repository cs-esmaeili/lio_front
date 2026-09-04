'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { payment } from '@/services/checkout.service';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { PaymentResponse } from '@/typescript/types/checkout.types';

export function useCouponApply() {
  const setCouponLoading = useCheckoutStore((s) => s.setCouponLoading);
  const setCouponData = useCheckoutStore((s) => s.setCouponData);
  const clearCouponData = useCheckoutStore((s) => s.clearCouponData);
  const setPaymentData = useCheckoutStore((s) => s.setPaymentData);

  const apply = useCallback(
    async (shippingMethodId: number, addressId: number, walletId: number, code: string, paymentMethodId?: number) => {
      setCouponLoading(true);
      try {
        const res = await payment(shippingMethodId, addressId, walletId, code, paymentMethodId);
        const body: PaymentResponse = res.data.data;

        setCouponData(body.cart);

        toast.success('کد تخفیف اعمال شد');
        return body;
      } catch (error) {
        if (!isApiError(error) || !error.handled) {
          toast.error(getApiErrorMessage(error, 'کد تخفیف معتبر نیست'));
        }
        return null;
      } finally {
        setCouponLoading(false);
      }
    },
    [setCouponLoading, setCouponData],
  );

  const remove = useCallback(
    async (shippingMethodId: number, addressId: number, walletId: number, paymentMethodId?: number) => {
      setCouponLoading(true);
      try {
        const res = await payment(shippingMethodId, addressId, walletId, '', paymentMethodId);
        const body: PaymentResponse = res.data.data;

        clearCouponData();
        setPaymentData(body.cart);

        toast.success('کد تخفیف حذف شد');
        return body;
      } catch (error) {
        if (!isApiError(error) || !error.handled) {
          toast.error(getApiErrorMessage(error, 'خطا در حذف کد تخفیف'));
        }
        return null;
      } finally {
        setCouponLoading(false);
      }
    },
    [setCouponLoading, clearCouponData, setPaymentData],
  );

  return { apply, remove };
}
