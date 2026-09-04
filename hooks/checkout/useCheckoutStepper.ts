'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useShippingCost } from './useShippingCost';
import { usePaymentSummary } from './usePaymentSummary';
import { usePaymentFinal } from './usePaymentFinal';
import { useCouponApply } from './useCouponApply';
import { useCheckoutStore, CheckoutStep } from '@/stores/checkoutStore';
import { CARD_TO_CARD_PAYMENT_ID } from '@/components/shop/checkout/PaymentSection';

function normalizePaymentMethodId(id: number | null): number {
  return id === CARD_TO_CARD_PAYMENT_ID ? 0 : (id ?? 0);
}

function isCardToCard(id: number | null): boolean {
  return id === CARD_TO_CARD_PAYMENT_ID;
}

/**
 * Checkout stepper.
 *
 * Flow:
 *   SelectAddress  + address picked   → onAddressSelected   → shipping refetch → SelectShipping
 *   SelectShipping + shipping ready    → auto via useEffect  → payment refetch  → Ready
 *   SelectShipping + user clicks       → onShippingSelected  → payment refetch  → Ready
 *   Ready          + pay clicked       → onPay               → execute          → Paying → redirect
 */
export function useCheckoutStepper() {
  const store = useCheckoutStore();

  // ── API hooks ──

  const shippingHook = useShippingCost();
  const paymentHook = usePaymentSummary();
  const paymentFinalHook = usePaymentFinal();
  const couponHook = useCouponApply();

  // ── stable function refs ──

  const shippingRefetch = shippingHook.refetch;
  const paymentRefetch = paymentHook.refetch;
  const couponApplyFn = couponHook.apply;
  const couponRemoveFn = couponHook.remove;
  const paymentExecute = paymentFinalHook.execute;
  const paymentClearError = paymentHook.clearPaymentError;

  // ── file upload ──

  const [transactionFile, setTransactionFile] = useState<File | undefined>();

  // ── store state ──

  const step = store.step;
  const selectedShippingMethodId = store.selectedShippingMethodId;
  const selectedAddressId = store.selectedAddressId;
  const selectedPaymentMethodId = store.selectedPaymentMethodId;
  const walletId = store.wallet?.id ?? 0;
  const cardToCardSelected = isCardToCard(selectedPaymentMethodId);

  // ── auto-transition: SelectShipping → fetch payment ──

  const doPaymentFetch = useCallback(
    async (cancelled: { value: boolean }) => {
      // NOTE: do NOT setStep here — step change triggers effect re-run,
      // cleanup cancels this IIFE. paymentSummaryLoading handles UI.
      const result = await paymentRefetch(
        selectedShippingMethodId!,
        selectedAddressId!,
        walletId,
        normalizePaymentMethodId(selectedPaymentMethodId),
      );
      if (cancelled.value) return;
      store.setStep(result ? CheckoutStep.Ready : CheckoutStep.SelectShipping);
    },
    [store, paymentRefetch, selectedShippingMethodId, selectedAddressId, walletId, selectedPaymentMethodId],
  );

  const doPaymentFetchRef = useRef(doPaymentFetch);
  doPaymentFetchRef.current = doPaymentFetch;

  useEffect(() => {
    if (
      step !== CheckoutStep.SelectShipping ||
      selectedShippingMethodId === null ||
      selectedAddressId == null
    )
      return;

    const cancelled = { value: false };
    doPaymentFetchRef.current(cancelled);

    return () => {
      cancelled.value = true;
    };
  }, [step, selectedShippingMethodId, selectedAddressId]);

  // re-fetch when user changes payment method while at Ready
  useEffect(() => {
    if (
      step !== CheckoutStep.Ready ||
      selectedShippingMethodId === null ||
      selectedAddressId == null
    )
      return;

    const cancelled = { value: false };
    doPaymentFetchRef.current(cancelled);

    return () => {
      cancelled.value = true;
    };
  }, [step, selectedPaymentMethodId, selectedShippingMethodId, selectedAddressId]);

  // ── action: address selected ──

  const onAddressSelected = useCallback(
    async (addressId: number) => {
      store.setStep(CheckoutStep.LoadingShipping);
      const result = await shippingRefetch(addressId);
      store.setStep(result ? CheckoutStep.SelectShipping : CheckoutStep.SelectAddress);
    },
    [store, shippingRefetch],
  );

  // ── action: shipping selected (user click) ──

  const onShippingSelected = useCallback(
    async (shippingId: number) => {
      store.setSelectedShippingMethod(shippingId);
      if (selectedAddressId == null) return;

      store.setStep(CheckoutStep.LoadingSummary);
      const result = await paymentRefetch(
        shippingId,
        selectedAddressId,
        walletId,
        normalizePaymentMethodId(selectedPaymentMethodId),
      );
      store.setStep(result ? CheckoutStep.Ready : CheckoutStep.SelectShipping);
    },
    [store, paymentRefetch, selectedAddressId, walletId, selectedPaymentMethodId],
  );

  // ── coupon ──

  const applyCoupon = useCallback(async () => {
    const shippingId = store.selectedShippingMethodId;
    const addrId = store.selectedAddressId;
    if (!shippingId || addrId == null) return;

    await couponApplyFn(
      shippingId,
      addrId,
      store.wallet?.id ?? 0,
      store.couponCode.trim(),
      normalizePaymentMethodId(store.selectedPaymentMethodId),
    );
  }, [store, couponApplyFn]);

  const removeCoupon = useCallback(async () => {
    const shippingId = store.selectedShippingMethodId;
    const addrId = store.selectedAddressId;
    if (!shippingId || addrId == null) return;

    await couponRemoveFn(
      shippingId,
      addrId,
      store.wallet?.id ?? 0,
      normalizePaymentMethodId(store.selectedPaymentMethodId),
    );
  }, [store, couponRemoveFn]);

  // ── pay ──

  const onPay = useCallback(async () => {
    const shippingId = store.selectedShippingMethodId;
    const addrId = store.selectedAddressId;
    if (!shippingId || addrId == null) return;

    store.setStep(CheckoutStep.Paying);
    const redirectRoute = await paymentExecute(
      shippingId,
      addrId,
      normalizePaymentMethodId(store.selectedPaymentMethodId),
      store.wallet?.id ?? 0,
      store.couponCode,
      transactionFile,
    );
    if (!redirectRoute) {
      store.setStep(CheckoutStep.Ready);
    }
  }, [store, paymentExecute, transactionFile]);

  // ── address saved → re-fetch payment ──

  const onAddressSaved = useCallback(async () => {
    const state = useCheckoutStore.getState();
    if (state.selectedShippingMethodId !== null && state.selectedAddressId != null) {
      store.setStep(CheckoutStep.LoadingSummary);
      const result = await paymentRefetch(
        state.selectedShippingMethodId,
        state.selectedAddressId,
        state.wallet?.id ?? 0,
        normalizePaymentMethodId(state.selectedPaymentMethodId),
      );
      store.setStep(result ? CheckoutStep.Ready : CheckoutStep.SelectShipping);
    }
    paymentClearError();
  }, [store, paymentRefetch, paymentClearError]);

  // ── derived ──

  const cardToCardMissingFile = cardToCardSelected && transactionFile == null;

  const canPay =
    step === CheckoutStep.Ready &&
    selectedAddressId != null &&
    selectedShippingMethodId !== null &&
    paymentHook.paymentErrorAddressId == null &&
    !cardToCardMissingFile;

  const isPaying = step === CheckoutStep.Paying;

  return useMemo(
    () => ({
      step,
      editAddressId:
        paymentHook.paymentErrorAddressId != null
          ? String(paymentHook.paymentErrorAddressId)
          : undefined,
      clearPaymentError: paymentClearError,
      transactionFile,
      setTransactionFile,
      isPaying,
      isShippingLoading: shippingHook.loading || store.shippingCostLoading,
      buttonDisabled: !canPay || isPaying,
      onAddressSelected,
      onShippingSelected,
      applyCoupon,
      removeCoupon,
      onPay,
      onAddressSaved,
    }),
    [
      step,
      paymentHook.paymentErrorAddressId,
      paymentClearError,
      transactionFile,
      shippingHook.loading,
      store.shippingCostLoading,
      canPay,
      isPaying,
      onAddressSelected,
      onShippingSelected,
      applyCoupon,
      removeCoupon,
      onPay,
      onAddressSaved,
    ],
  );
}
