import { create } from 'zustand';

interface ProductBottomNavState {
  baseAttributes: any[] | null;
  prices: any[] | null;
  product: any | null;
  setProductData: (data: {
    baseAttributes: any[];
    prices: any[];
    product: any;
  }) => void;
  clear: () => void;
}

export const useProductBottomNavStore = create<ProductBottomNavState>((set) => ({
  baseAttributes: null,
  prices: null,
  product: null,

  setProductData: ({ baseAttributes, prices, product }) =>
    set({ baseAttributes, prices, product }),

  clear: () => set({ baseAttributes: null, prices: null, product: null }),
}));
