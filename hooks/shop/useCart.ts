'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useCartStore, type CartItemEntry } from '@/stores/cartStore';
import { useCartDataStore } from '@/stores/cartDataStore';
import { addToCardNoAuth, addToCartMany, getCart } from '@/services/cart.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import { getAuthToken } from '@/hooks/useAuth';
import { useAddToCartApi } from '@/hooks/shop/useAddToCart';
import { useUpdateCartApi } from '@/hooks/shop/useUpdateCart';
import { useRemoveCartApi } from '@/hooks/shop/useRemoveCartApi';

// ── Re-exports ──────────────────────────────────────────────
export type { CartItemEntry };

export interface CartProductItem {
  cart_id: number;
  base_amount: number;
  base_discount: number;
  quantity: number;
  final_amount: number;
  product: {
    id: number;
    product_id: number;
    product_price_id: number;
    title: string;
    slug: string;
    image: string;
    barcode: string;
    min_order: number;
    max_order: number;
    attributes: any[];
    is_change: number;
  };
}

export interface CartSummary {
  items_count: number;
  base_price: number;
  currency_symbol: string;
  discount: number;
  discount_percent: number;
  max_persent: number;
  remaining: number;
  max_price: number;
  final_price: number;
  payment_price: number;
}

export interface CartDetailsResponse {
  cart: CartSummary;
  cart_items: CartProductItem[];
  cart_change: any[];
}

// ── Helpers ─────────────────────────────────────────────────

function showError(error: unknown, fallback: string): void {
  if (!isApiError(error) || !error.handled) {
    toast.error(getApiErrorMessage(error, fallback));
  }
}

/** Convert API response items back to store entries so CartIcon/AddToCart stay in sync. */
function syncStoreFromResponse(data: CartDetailsResponse | null): void {
  if (!data) {
    useCartStore.getState().clearCart();
    return;
  }
  const entries: CartItemEntry[] = data.cart_items.map((ci) => ({
    variant_id: ci.product.product_price_id,
    product_id: ci.product.product_id,
    quantity: ci.quantity,
    cart_id: ci.cart_id,
  }));
  // Replace store items entirely for logged-in users — server is the source of truth.
  // For guests this is harmless because fetchCart always reads store first.
  useCartStore.setState({ items: entries });
}

// ── Hook ────────────────────────────────────────────────────

export function useCart() {
  const { addToCartApi } = useAddToCartApi();
  const { updateCartApi } = useUpdateCartApi();
  const { removeCartApi } = useRemoveCartApi();

  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Shared cart data — all useCart instances read the same source
  const data = useCartDataStore((s) => s.data);
  const loading = useCartDataStore((s) => s.loading);

  const isAuthenticated = !!getAuthToken();

  // ── ensureData (fetch if not loaded) ──────────────────

  /**
   * If `data` is already loaded, return it immediately.
   * Otherwise fetch cart from server, update shared store, and return fetched data.
   * This prevents the "data is null" race condition where addToCart/updateQuantity
   * are called before the first fetchCart has completed.
   */
  const ensureData = useCallback(async (): Promise<CartDetailsResponse | null> => {
    const current = useCartDataStore.getState().data;
    if (current !== null) return current;

    try {
      if (isAuthenticated) {
        const res = await getCart();
        const responseData: CartDetailsResponse = res.data.data;
        useCartDataStore.getState().setData(responseData);
        syncStoreFromResponse(responseData);
        return responseData;
      } else {
        const items = useCartStore.getState().items;
        if (!items.length) {
          useCartDataStore.getState().setData(null);
          return null;
        }
        const res = await addToCardNoAuth(items);
        const responseData: CartDetailsResponse = res.data.data;
        useCartDataStore.getState().setData(responseData);
        return responseData;
      }
    } catch {
      return null;
    }
  }, [isAuthenticated]);

  // ── fetchCart helpers ──────────────────────────────────

  const fetchCartSilent = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const res = await getCart();
        const responseData: CartDetailsResponse = res.data.data;
        useCartDataStore.getState().setData(responseData);
        syncStoreFromResponse(responseData);
      } else {
        const items = useCartStore.getState().items;
        if (!items.length) {
          useCartDataStore.getState().setData(null);
          return;
        }
        const res = await addToCardNoAuth(items);
        useCartDataStore.getState().setData(res.data.data);
      }
    } catch {
      /* silent */
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        useCartDataStore.getState().setLoading(true);
        const res = await getCart();
        const responseData: CartDetailsResponse = res.data.data;
        useCartDataStore.getState().setData(responseData);
        syncStoreFromResponse(responseData);
      } else {
        const items = useCartStore.getState().items;
        if (!items.length) {
          useCartDataStore.getState().setData(null);
          useCartDataStore.getState().setLoading(false);
          return;
        }
        useCartDataStore.getState().setLoading(true);
        const res = await addToCardNoAuth(items);
        useCartDataStore.getState().setData(res.data.data);
      }
    } catch (error: any) {
      showError(error, 'خطا در دریافت اطلاعات سبد خرید');
    } finally {
      useCartDataStore.getState().setLoading(false);
    }
  }, [isAuthenticated]);

  // ── addToCart ──────────────────────────────────────────

  const addToCart = async (variant_id: number, product_id: number, quantity: number, max_order?: number): Promise<boolean> => {
    setAddToCartLoading(true);

    try {
      if (max_order != null && quantity > max_order) {
        toast.error(`حداکثر تعداد مجاز ${max_order} عدد می‌باشد.`);
        return false;
      }

      // ── Guest — localStorage only ──────────────────────
      if (!isAuthenticated) {
        const existing = useCartStore.getState().items.find((i) => i.variant_id === variant_id);
        if (existing) {
          useCartStore.getState().updateQuantity(variant_id, quantity);
          toast.success('سبد خرید بروزرسانی شد');
        } else {
          useCartStore.getState().addItem(variant_id, product_id, quantity);
          toast.success('محصول با موفقیت به سبد خرید اضافه شد');
        }
        await fetchCartSilent();
        return true;
      }

      // ── Logged-in — API only ───────────────────────────
      const cartData = (await ensureData()) ?? useCartDataStore.getState().data;
      const existing = cartData?.cart_items.find((ci) => ci.product.product_price_id === variant_id);

      if (existing) {
        await updateCartApi(existing.cart_id, quantity);
        toast.success('سبد خرید بروزرسانی شد');
      } else {
        const cart_id = await addToCartApi(product_id, variant_id);
        if (cart_id && quantity > 1) await updateCartApi(cart_id, quantity);
        toast.success('محصول با موفقیت به سبد خرید اضافه شد');
      }

      await fetchCartSilent();
      return true;
    } catch (error: any) {
      showError(error, 'خطا در افزودن محصول به سبد خرید. دوباره تلاش کنید.');
      return false;
    } finally {
      setAddToCartLoading(false);
    }
  };

  // ── updateQuantity ─────────────────────────────────────

  const updateQuantity = useCallback(
    async (variant_id: number, quantity: number) => {
      setUpdatingItems((prev) => new Set(prev).add(variant_id));

      try {
        if (isAuthenticated) {
          // API only — ensure data is loaded before lookup
          const cartData = (await ensureData()) ?? useCartDataStore.getState().data;
          const item = cartData?.cart_items.find((ci) => ci.product.product_price_id === variant_id);
          if (item) await updateCartApi(item.cart_id, quantity);
        } else {
          // Guest — localStorage only
          useCartStore.getState().updateQuantity(variant_id, quantity);
        }

        // Optimistic UI update in shared store
        useCartDataStore.setState((prev) => {
          const prevData = prev.data;
          if (!prevData) return prev;
          if (quantity <= 0) {
            return { data: { ...prevData, cart_items: prevData.cart_items.filter((ci) => ci.product.product_price_id !== variant_id) } };
          }
          return { data: { ...prevData, cart_items: prevData.cart_items.map((ci) => (ci.product.product_price_id === variant_id ? { ...ci, quantity } : ci)) } };
        });

        await fetchCartSilent();
      } catch (error: any) {
        showError(error, 'خطا در بروزرسانی سبد خرید');
      } finally {
        setUpdatingItems((prev) => {
          const next = new Set(prev);
          next.delete(variant_id);
          return next;
        });
      }
    },
    [fetchCartSilent, updateCartApi, isAuthenticated, ensureData]
  );

  // ── removeItem ─────────────────────────────────────────

  const removeItem = useCallback(
    async (variant_id: number) => {
      setUpdatingItems((prev) => new Set(prev).add(variant_id));

      try {
        if (isAuthenticated) {
          // API only — ensure data is loaded before lookup
          const cartData = (await ensureData()) ?? useCartDataStore.getState().data;
          const item = cartData?.cart_items.find((ci) => ci.product.product_price_id === variant_id);
          if (item) await removeCartApi([item.cart_id]);
        } else {
          // Guest — localStorage only
          useCartStore.getState().removeItem(variant_id);
        }

        // Optimistic UI update in shared store
        useCartDataStore.setState((prev) => {
          const prevData = prev.data;
          if (!prevData) return prev;
          return { data: { ...prevData, cart_items: prevData.cart_items.filter((ci) => ci.product.product_price_id !== variant_id) } };
        });

        await fetchCartSilent();
      } catch (error: any) {
        showError(error, 'خطا در حذف محصول از سبد خرید');
      } finally {
        setUpdatingItems((prev) => {
          const next = new Set(prev);
          next.delete(variant_id);
          return next;
        });
      }
    },
    [fetchCartSilent, removeCartApi, isAuthenticated, ensureData]
  );

  // ── syncGuestCart (login-time: localStorage → server) ──

  const syncGuestCart = useCallback(async (): Promise<boolean> => {
    const items = useCartStore.getState().items;
    if (!items.length) return false;

    try {
      await addToCartMany(items.map((i) => ({
        variant_id: i.variant_id,
        product_id: i.product_id,
        quantity: i.quantity,
      })));
      return true;
    } catch (error: unknown) {
      if (!isApiError(error) || !error.handled) {
        toast.error(getApiErrorMessage(error, 'خطا در همگام‌سازی سبد خرید'));
      }
      return false;
    } finally {
      // Always clear local cart after login attempt — server is now source of truth.
      // Bypass Zustand persist middleware and nuke localStorage directly to avoid
      // any timing issues with persist writes before navigation.
      useCartStore.getState().clearCart();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('cart-items');
      }
    }
  }, []);

  // ── Return ─────────────────────────────────────────────

  const cartItems = data?.cart_items ?? [];
  const cartSummary = data?.cart ?? null;
  const isEmpty = !loading && cartItems.length === 0;

  return {
    addToCart,
    addToCartLoading,
    data,
    loading,
    isEmpty,
    cartItems,
    cartSummary,
    updatingItems,
    updateQuantity,
    removeItem,
    refetch: fetchCart,
    syncGuestCart,
  } as const;
}
