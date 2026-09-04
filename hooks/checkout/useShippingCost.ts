'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { shippingCost } from '@/services/checkout.service';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { CARD_TO_CARD_PAYMENT_ID } from '@/components/shop/checkout/PaymentSection';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { ShippingCostResponse } from '@/typescript/types/checkout.types';

/**
 * Pure API hook. No step management, no useEffect.
 * refetch(addressId) calls the API and writes results to store.
 * Returns loading + data so the stepper can check success/failure.
 */
export function useShippingCost() {
  const [data, setData] = useState<ShippingCostResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const setShippingData = useCheckoutStore((s) => s.setShippingData);
  const setShippingCostLoading = useCheckoutStore((s) => s.setShippingCostLoading);
  const setSelectedShippingMethod = useCheckoutStore((s) => s.setSelectedShippingMethod);
  const setSelectedPaymentMethod = useCheckoutStore((s) => s.setSelectedPaymentMethod);

  const refetch = useCallback(async (addressId: number): Promise<ShippingCostResponse | null> => {
    if (!Number.isFinite(addressId) || addressId <= 0) return null;

    setLoading(true);
    setShippingCostLoading(true);

    try {
      const res = await shippingCost(addressId);
      const body: ShippingCostResponse = res.data.data;

      setData(body);

      setShippingData(
        body.shipping_methods,
        body.payment_methods,
        body.wallet,
        body.coupon.show_box,
        body.card_methods,
        body.payment_methods_data,
      );

      if (body.shipping_methods.length > 0) {
        setSelectedShippingMethod(body.shipping_methods[0].id);
      }

      if (body.payment_methods.length > 0) {
        setSelectedPaymentMethod(body.payment_methods[0].id);
      } else if (body.card_methods) {
        // no regular payment methods, card-to-card available → select it
        setSelectedPaymentMethod(CARD_TO_CARD_PAYMENT_ID);
      }

      return body;
    } catch (error) {
      if (!isApiError(error) || !error.handled) {
        toast.error(getApiErrorMessage(error, 'خطا در دریافت هزینه ارسال'));
      }
      return null;
    } finally {
      setLoading(false);
      setShippingCostLoading(false);
    }
  }, [setShippingData, setShippingCostLoading, setSelectedShippingMethod, setSelectedPaymentMethod]);

  return { data, loading, refetch };
}
