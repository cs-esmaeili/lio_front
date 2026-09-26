'use client';

import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { getCheckoutCSR } from '@/services/checkout.service';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/**
 * The checkout page's single data hook. It fetches `GET /checkout`, hydrates
 * the store and exposes the selection helpers. No chained loaders, no other
 * API: address choice is local state and the buy button is intentionally inert.
 */
export function useCheckout() {
  const checkout = useCheckoutStore((s) => s.checkout);
  const loading = useCheckoutStore((s) => s.loading);
  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId);
  const setCheckout = useCheckoutStore((s) => s.setCheckout);
  const setLoading = useCheckoutStore((s) => s.setLoading);
  const setSelectedAddressId = useCheckoutStore((s) => s.setSelectedAddressId);
  const reset = useCheckoutStore((s) => s.reset);

  const refetch = useCallback(async (): Promise<boolean> => {
    setLoading(true);

    try {
      const data = await getCheckoutCSR();
      setCheckout(data);
      return true;
    } catch (error) {
      if (!isApiError(error) || !error.handled) {
        toast.error(getApiErrorMessage(error, 'خطا در دریافت اطلاعات سفارش'));
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [setCheckout, setLoading]);

  useEffect(() => reset, [reset]);

  const selectedAddress = checkout?.addresses.find((address) => address.id === selectedAddressId) ?? null;

  return {
    checkout,
    loading,
    selectedAddressId,
    selectedAddress,
    refetch,
    selectAddress: setSelectedAddressId,
  } as const;
}
