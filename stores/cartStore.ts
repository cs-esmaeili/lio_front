import { createStore } from 'zustand/vanilla';
import type { Cart } from '@/typescript/schemas/cart.schema';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  loaded: boolean;
  pending: boolean;
  isOpen: boolean;
  updatingVariants: Set<number>;

  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
  setPending: (pending: boolean) => void;
  setUpdating: (variantId: number, updating: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  reset: () => void;
}

/**
 * Vanilla cart store — the single source of truth for cart state.
 * `useCart` is the only hook that reads/writes it, so there is exactly one
 * cart-management hook in the app.
 */
export const cartStore = createStore<CartState>()((set, get) => ({
  cart: null,
  loading: true,
  loaded: false,
  pending: false,
  isOpen: false,
  updatingVariants: new Set<number>(),

  setCart: (cart) => set({ cart, loading: false, loaded: true }),
  setLoading: (loading) => set({ loading }),
  setPending: (pending) => set({ pending }),

  setUpdating: (variantId, updating) => {
    const next = new Set(get().updatingVariants);
    if (updating) next.add(variantId);
    else next.delete(variantId);
    set({ updatingVariants: next });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  reset: () =>
    set({
      cart: null,
      loading: true,
      loaded: false,
      pending: false,
      isOpen: false,
      updatingVariants: new Set<number>(),
    }),
}));
