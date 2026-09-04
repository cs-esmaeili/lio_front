export interface ShippingMethod {
  id: number;
  title: string;
  amount: number;
  min_post_day: number;
  min_post_time: string;
  max_post_time: string;
}

export interface PaymentMethod {
  id: number;
  title: string;
  image: string;
  key: string;
}

export interface CardMethodData {
  number_card: string;
  sheba_card: string;
  name_card: string;
  title_card: string;
}

export interface WalletInfo {
  id: number;
  balance: number;
}

export interface CouponInfo {
  show_box: boolean;
}

export interface CouponPostInfo {
  discount_value: number;
  is_free: boolean;
  is_percent: boolean;
  max_value: number;
}

export interface CheckoutCartInfo {
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
  post_price: number;
  min_post_time: number;

  coupon_amount?: number;
  coupon_percent?: number;
  discount_card?: number;
  percentage_card?: number;
  have_coupon_post?: CouponPostInfo | null;
  wallet_id?: number;
  wallet_price?: number;
}

export interface ShippingCostResponse {
  cart: CheckoutCartInfo;
  cart_items: unknown[];
  cart_change: unknown[];
  shipping_methods: ShippingMethod[];
  min_post_day: number;
  payment_methods: PaymentMethod[];
  wallet: WalletInfo;
  coupon: CouponInfo;
  card_methods?: boolean;
  payment_methods_data?: CardMethodData[];
  percentage_card?: number;
}

export interface OrderInvoiceGateway {
  title: string;
  amount: number;
  successful: boolean;
  is_card: boolean;
}

export interface OrderInvoiceOrder {
  id: number;
  code: number;
  is_payment: number;
  final_amount: number;
  currency_symbol: string;
}

export interface PaymentResponse {
  cart: CheckoutCartInfo;
  cart_items: unknown[];
  cart_change: unknown[];
  shipping_methods: ShippingMethod[];
  min_post_day: number;
  payment_methods: PaymentMethod[];
  wallet: WalletInfo;
  card_methods?: boolean;
  payment_methods_data?: CardMethodData[];
  percentage_card?: number;
}

export interface OrderInvoiceResponse {
  status: number;
  data: {
    order: OrderInvoiceOrder;
    gateways: OrderInvoiceGateway[];
  };
}
