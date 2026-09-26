'use client';

import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { toast } from 'sonner';
import { cartStore } from '@/stores/cartStore';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import { useCsrf } from '@/hooks/useCsrf';
import { useGuestCartToken } from '@/hooks/cart/useGuestCartToken';
import { useCartRequest } from '@/hooks/cart/useCartRequest';

function showError(error: unknown, fallback: string): void {
  if (!isApiError(error) || !error.handled) {
    toast.error(getApiErrorMessage(error, fallback));
  }
}

/**
 * The single cart-management hook. It only orchestrates state and UX:
 * requests/parsing live in `useCartRequest`, CSRF in `useCsrf`, and the guest
 * identity in `useGuestCartToken`.
 */
export function useCart() {
  const cart = useStore(cartStore, (s) => s.cart);
  const loading = useStore(cartStore, (s) => s.loading);
  const pending = useStore(cartStore, (s) => s.pending);
  const isOpen = useStore(cartStore, (s) => s.isOpen);
  const updatingVariants = useStore(cartStore, (s) => s.updatingVariants);

  const { getCart, addCartItem, updateCartItem, removeCartItem } = useCartRequest();
  const { bootstrapCsrf } = useCsrf();
  const { ensureGuestToken, clearGuestToken, rotateGuestToken } = useGuestCartToken();

  useEffect(() => {
    void bootstrapCsrf();
    ensureGuestToken();
  }, [bootstrapCsrf, ensureGuestToken]);

  const refetch = useCallback(async (): Promise<boolean> => {
    if (!cartStore.getState().loaded) cartStore.getState().setLoading(true);
    try {
      const next = await getCart();
      cartStore.getState().setCart(next);
      return true;
    } catch (error) {
      cartStore.getState().setLoading(false);
      showError(error, 'خطا در دریافت اطلاعات سبد خرید');
      return false;
    }
  }, [getCart]);

  const addItem = useCallback(
    async (variantId: number, quantity = 1, maxOrder?: number): Promise<boolean> => {
      if (maxOrder != null && quantity > maxOrder) {
        toast.error(`حداکثر تعداد مجاز ${maxOrder} عدد می‌باشد.`);
        return false;
      }

      cartStore.getState().setPending(true);
      try {
        const next = await addCartItem(variantId, quantity);
        cartStore.getState().setCart(next);
        toast.success('محصول با موفقیت به سبد خرید اضافه شد');
        return true;
      } catch (error) {
        showError(error, 'خطا در افزودن محصول به سبد خرید. دوباره تلاش کنید.');
        return false;
      } finally {
        cartStore.getState().setPending(false);
      }
    },
    [addCartItem],
  );

  const updateQuantity = useCallback(
    async (variantId: number, quantity: number): Promise<void> => {
      cartStore.getState().setUpdating(variantId, true);
      try {
        const next = await updateCartItem(variantId, quantity);
        cartStore.getState().setCart(next);
      } catch (error) {
        showError(error, 'خطا در بروزرسانی سبد خرید');
      } finally {
        cartStore.getState().setUpdating(variantId, false);
      }
    },
    [updateCartItem],
  );

  const removeItem = useCallback(
    async (variantId: number): Promise<void> => {
      cartStore.getState().setUpdating(variantId, true);
      try {
        const next = await removeCartItem(variantId);
        cartStore.getState().setCart(next);
      } catch (error) {
        showError(error, 'خطا در حذف محصول از سبد خرید');
      } finally {
        cartStore.getState().setUpdating(variantId, false);
      }
    },
    [removeCartItem],
  );

  /** After login the first cart request carries X-Cart-Token, which merges. */
  const mergeAfterLogin = useCallback(async (): Promise<void> => {
    const merged = await refetch();
    if (merged) clearGuestToken();
  }, [refetch, clearGuestToken]);

  const resetAfterLogout = useCallback((): void => {
    cartStore.getState().reset();
    rotateGuestToken();
  }, [rotateGuestToken]);

  const openCart = useCallback((): void => cartStore.getState().openCart(), []);
  const closeCart = useCallback((): void => cartStore.getState().closeCart(), []);
  const toggleCart = useCallback((): void => cartStore.getState().toggleCart(), []);

  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const distinctItemCount = cart?.distinctItemCount ?? items.length;
  const subtotal = cart?.subtotal ?? 0;
  const totalDiscount = cart?.totalDiscount ?? 0;
  const isEmpty = !loading && items.length === 0;

  const isUpdating = useCallback(
    (variantId: number): boolean => updatingVariants.has(variantId),
    [updatingVariants],
  );

  return {
    cart,
    items,
    itemCount,
    distinctItemCount,
    subtotal,
    totalDiscount,
    loading,
    isEmpty,
    isOpen,
    updatingVariants,
    isUpdating,
    addToCartLoading: pending,
    addItem,
    updateQuantity,
    removeItem,
    refetch,
    mergeAfterLogin,
    resetAfterLogout,
    openCart,
    closeCart,
    toggleCart,
  } as const;
}
