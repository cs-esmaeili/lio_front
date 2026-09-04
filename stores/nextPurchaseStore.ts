import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartProductItem } from '@/hooks/shop/useCart';

interface NextPurchaseState {
  items: CartProductItem[];

  addItem: (item: CartProductItem) => void;
  removeItem: (cartProductPriceId: number) => void;
  clear: () => void;
}

export const useNextPurchaseStore = create<NextPurchaseState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set({ items: [...get().items, item] });
      },

      removeItem: (cartProductPriceId) => {
        set({ items: get().items.filter((i) => i.product.product_price_id !== cartProductPriceId) });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'next-purchase',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
