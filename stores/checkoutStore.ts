import { create } from 'zustand';

import type { Checkout } from '@/typescript/schemas/checkout.schema';

interface CheckoutState {
  /** Full `GET /checkout` payload, or null before the first successful load. */
  checkout: Checkout | null;
  loading: boolean;
  /** Selected delivery address id (the `Address.id`, which is a string). */
  selectedAddressId: string | null;

  setCheckout: (checkout: Checkout) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAddressId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  checkout: null as Checkout | null,
  loading: true,
  selectedAddressId: null as string | null,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialState,

  /**
   * Store a fresh payload and reconcile the address selection: keep the
   * current one when it still exists, otherwise fall back to the default
   * address, then to the first address.
   */
  setCheckout: (checkout) =>
    set((state) => {
      const ids = checkout.addresses.map((address) => address.id);
      const current = state.selectedAddressId;
      const fallback = checkout.defaultAddressId != null ? String(checkout.defaultAddressId) : (ids[0] ?? null);

      return {
        checkout,
        selectedAddressId: current !== null && ids.includes(current) ? current : fallback,
      };
    }),

  setLoading: (loading) => set({ loading }),

  setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId }),

  reset: () => set(initialState),
}));
