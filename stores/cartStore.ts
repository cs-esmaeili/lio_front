import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemEntry {
  variant_id: number;
  product_id: number;
  quantity: number;
  cart_id?: number;
}

interface CartState {
  items: CartItemEntry[];

  addItem: (variant_id: number, product_id: number, quantity: number, cart_id?: number) => void;
  updateQuantity: (variant_id: number, quantity: number) => void;
  removeItem: (variant_id: number) => void;
  getVariantQty: (variant_id: number) => number;
  setCartId: (variant_id: number, cart_id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (variant_id, product_id, quantity, cart_id) => {
        const items = get().items;
        const existing = items.find((i) => i.variant_id === variant_id);
        if (existing) {
          set({ items: items.map((i) => (i.variant_id === variant_id ? { ...i, quantity: i.quantity + quantity } : i)) });
        } else {
          set({ items: [...items, { variant_id, product_id, quantity, ...(cart_id != null ? { cart_id } : {}) }] });
        }
      },

      updateQuantity: (variant_id, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.variant_id !== variant_id) });
        } else {
          set({ items: items.map((i) => (i.variant_id === variant_id ? { ...i, quantity } : i)) });
        }
      },

      removeItem: (variant_id) => {
        set({ items: get().items.filter((i) => i.variant_id !== variant_id) });
      },

      getVariantQty: (variant_id) => {
        return get().items.find((i) => i.variant_id === variant_id)?.quantity ?? 0;
      },

      setCartId: (variant_id, cart_id) => {
        set({ items: get().items.map((i) => (i.variant_id === variant_id ? { ...i, cart_id } : i)) });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-items',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
