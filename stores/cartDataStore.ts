import { create } from 'zustand';
import type { CartDetailsResponse } from '@/hooks/shop/useCart';

interface CartDataState {
  data: CartDetailsResponse | null;
  loading: boolean;

  setData: (data: CartDetailsResponse | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useCartDataStore = create<CartDataState>((set) => ({
  data: null,
  loading: true,

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  clear: () => set({ data: null, loading: true }),
}));
