import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CompareData {
  productCategory: string;
  products: string[];
}

interface CompareState {
  data: CompareData | null;
  readonly MAX_ITEMS: number;

  toggle: (productId: string, productCategory: string) => { added: boolean; reason?: 'category_mismatch' | 'max_items' };
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      data: null,
      MAX_ITEMS: 4,

      toggle: (productId, productCategory) => {
        const data = get().data;

        // --- remove ---
        if (data && data.products.includes(productId)) {
          const updated = data.products.filter((id) => id !== productId);
          set({ data: updated.length === 0 ? null : { ...data, products: updated } });
          return { added: false };
        }

        // --- add: no data yet ---
        if (!data) {
          set({ data: { productCategory, products: [productId] } });
          return { added: true };
        }

        // --- add: same category ---
        if (data.productCategory === productCategory) {
          if (data.products.length >= get().MAX_ITEMS) {
            return { added: false, reason: 'max_items' };
          }
          set({ data: { ...data, products: [...data.products, productId] } });
          return { added: true };
        }

        // --- add: different category → replace ---
        set({ data: { productCategory, products: [productId] } });
        return { added: true };
      },

      remove: (productId) => {
        const data = get().data;
        if (!data) return;
        const updated = data.products.filter((id) => id !== productId);
        set({ data: updated.length === 0 ? null : { ...data, products: updated } });
      },

      clear: () => set({ data: null }),

      has: (productId) => {
        const data = get().data;
        return data ? data.products.includes(productId) : false;
      },
    }),
    {
      name: 'compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
