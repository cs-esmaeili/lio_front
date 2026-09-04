import { create } from 'zustand';
import type { ShippingMethod, PaymentMethod, WalletInfo, CheckoutCartInfo, CardMethodData } from '@/typescript/types/checkout.types';

/** Stepper — explicit flow steps */
export enum CheckoutStep {
  SelectAddress = 'select_address',
  LoadingShipping = 'loading_shipping',
  SelectShipping = 'select_shipping',
  LoadingSummary = 'loading_summary',
  Ready = 'ready',
  Paying = 'paying',
}

interface CheckoutState {
  // flow step
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;

  // data from shippingCost API
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  wallet: WalletInfo | null;
  showCouponBox: boolean;

  // card-to-card payment
  cardMethods: boolean;
  paymentMethodsData: CardMethodData[];
  percentageCard: number | null;

  // user selections
  selectedAddressId: number | undefined;
  selectedShippingMethodId: number | null;
  selectedPaymentMethodId: number | null;
  couponCode: string;

  // loading
  shippingCostLoading: boolean;
  couponLoading: boolean;

  // coupon result
  couponCart: CheckoutCartInfo | null;

  // payment summary (fetched via /payment when address + shipping selected)
  paymentCart: CheckoutCartInfo | null;
  paymentSummaryLoading: boolean;

  // actions
  setShippingData: (
    shippingMethods: ShippingMethod[],
    paymentMethods: PaymentMethod[],
    wallet: WalletInfo,
    showCouponBox: boolean,
    cardMethods?: boolean,
    paymentMethodsData?: CardMethodData[],
  ) => void;
  setCardMethodsData: (cardMethods: boolean, paymentMethodsData: CardMethodData[]) => void;
  setPercentageCard: (percentageCard: number | null) => void;
  setSelectedAddressId: (id: number | undefined) => void;
  setSelectedShippingMethod: (id: number) => void;
  setSelectedPaymentMethod: (id: number) => void;
  setCouponCode: (code: string) => void;
  setShippingCostLoading: (loading: boolean) => void;
  setCouponLoading: (loading: boolean) => void;
  setCouponData: (cart: CheckoutCartInfo) => void;
  clearCouponData: () => void;
  setPaymentData: (cart: CheckoutCartInfo) => void;
  setPaymentSummaryLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  step: CheckoutStep.SelectAddress,
  shippingMethods: [] as ShippingMethod[],
  paymentMethods: [] as PaymentMethod[],
  wallet: null as WalletInfo | null,
  showCouponBox: false,
  cardMethods: false,
  paymentMethodsData: [] as CardMethodData[],
  percentageCard: null as number | null,
  selectedAddressId: undefined as number | undefined,
  selectedShippingMethodId: null as number | null,
  selectedPaymentMethodId: null as number | null,
  couponCode: '',
  shippingCostLoading: false,
  couponLoading: false,
  couponCart: null as CheckoutCartInfo | null,
  paymentCart: null as CheckoutCartInfo | null,
  paymentSummaryLoading: false,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setShippingData: (shippingMethods, paymentMethods, wallet, showCouponBox, cardMethods, paymentMethodsData) =>
    set({ shippingMethods, paymentMethods, wallet, showCouponBox, cardMethods: cardMethods ?? false, paymentMethodsData: paymentMethodsData ?? [] }),

  setCardMethodsData: (cardMethods, paymentMethodsData) =>
    set({ cardMethods, paymentMethodsData }),

  setPercentageCard: (percentageCard) => set({ percentageCard }),

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),

  setSelectedShippingMethod: (id) => set({ selectedShippingMethodId: id }),

  setSelectedPaymentMethod: (id) => set({ selectedPaymentMethodId: id }),

  setCouponCode: (code) => set({ couponCode: code }),

  setShippingCostLoading: (loading) => set({ shippingCostLoading: loading }),

  setCouponLoading: (loading) => set({ couponLoading: loading }),

  setCouponData: (cart) => set({ couponCart: cart }),

  clearCouponData: () => set({ couponCart: null, couponCode: '' }),

  setPaymentData: (cart) => set({ paymentCart: cart }),

  setPaymentSummaryLoading: (loading) => set({ paymentSummaryLoading: loading }),

  reset: () => set(initialState),
}));
