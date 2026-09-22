'use client';

import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { toast } from 'sonner';
import { cartStore } from '@/stores/cartStore';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import {
  bootstrapCsrf,
  ensureGuestToken,
  clearGuestToken,
  rotateGuestToken,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '@/services/cart.service';
import type { Cart } from '@/typescript/schemas/cart.schema';

function showError(error: unknown, fallback: string): void {
  if (!isApiError(error) || !error.handled) {
    toast.error(getApiErrorMessage(error, fallback));
  }
}

/** Backend rejects a mutation with this when it sees neither auth nor X-Cart-Token. */
function isGuestTokenRequired(error: unknown): boolean {
  return isApiError(error) && error.status === 400 && /X-Cart-Token/i.test(error.message);
}

/**
 * The single cart-management hook.
 *
 * - Guest identity lives in `localStorage` (`X-Cart-Token`); auth uses the
 *   HttpOnly cookie, both sent with `credentials: 'include'`.
 * - CSRF is bootstrapped once and re-read from the cookie on every mutation.
 * - Every mutation returns the full, fresh cart, so state is replaced — no
 *   refetch required.
 */
export function useCart() {
  const cart = useStore(cartStore, (s) => s.cart);
  const loading = useStore(cartStore, (s) => s.loading);
  const pending = useStore(cartStore, (s) => s.pending);
  const isOpen = useStore(cartStore, (s) => s.isOpen);
  const updatingVariants = useStore(cartStore, (s) => s.updatingVariants);

  useEffect(() => {
    void bootstrapCsrf();
    ensureGuestToken();
  }, []);

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
  }, []);

  /** A mutation drops the session silently when the auth token expired. */
  const runMutation = useCallback(async (operation: () => Promise<Cart>): Promise<Cart> => {
    try {
      return await operation();
    } catch (error) {
      if (!isGuestTokenRequired(error)) throw error;
      rotateGuestToken();
      return operation();
    }
  }, []);

  const addItem = useCallback(
    async (variantId: number, quantity = 1, maxOrder?: number): Promise<boolean> => {
      if (maxOrder != null && quantity > maxOrder) {
        toast.error(`حداکثر تعداد مجاز ${maxOrder} عدد می‌باشد.`);
        return false;
      }

      cartStore.getState().setPending(true);
      try {
        const next = await runMutation(() => addCartItem(variantId, quantity));
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
    [runMutation],
  );

  const updateQuantity = useCallback(
    async (variantId: number, quantity: number): Promise<void> => {
      cartStore.getState().setUpdating(variantId, true);
      try {
        const next = await runMutation(() => updateCartItem(variantId, quantity));
        cartStore.getState().setCart(next);
      } catch (error) {
        showError(error, 'خطا در بروزرسانی سبد خرید');
      } finally {
        cartStore.getState().setUpdating(variantId, false);
      }
    },
    [runMutation],
  );

  const removeItem = useCallback(
    async (variantId: number): Promise<void> => {
      cartStore.getState().setUpdating(variantId, true);
      try {
        const next = await runMutation(() => removeCartItem(variantId));
        cartStore.getState().setCart(next);
      } catch (error) {
        showError(error, 'خطا در حذف محصول از سبد خرید');
      } finally {
        cartStore.getState().setUpdating(variantId, false);
      }
    },
    [runMutation],
  );

  /** After login the first cart request carries X-Cart-Token, which merges. */
  const mergeAfterLogin = useCallback(async (): Promise<void> => {
    const merged = await refetch();
    if (merged) clearGuestToken();
  }, [refetch]);

  const resetAfterLogout = useCallback((): void => {
    cartStore.getState().reset();
    rotateGuestToken();
  }, []);

  const openCart = useCallback((): void => cartStore.getState().openCart(), []);
  const closeCart = useCallback((): void => cartStore.getState().closeCart(), []);
  const toggleCart = useCallback((): void => cartStore.getState().toggleCart(), []);

  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const distinctItemCount = cart?.distinctItemCount ?? items.length;
  const subtotal = cart?.subtotal ?? 0;
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
