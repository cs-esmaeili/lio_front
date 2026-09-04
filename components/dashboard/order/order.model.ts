export interface OrderItem {
  id: string;

  productId: number;

  title: string;

  slug: string;

  image: string;

  quantity: number;

  unitPrice: number;

  currency: string;
}


export interface OrderPrice {
  subtotal: number;

  discount: number;

  coupon: number;

  shippingCost: number;

  vat: number;

  totalPrice: number;

  currency: string;

  cardDiscount: number | null;

  transactionFile: string | null;
}


export interface OrderCustomer {
  name: string;

  mobile: string;

  address: string;
}


export interface OrderShipping {
  method: string;

  deliveryDate: string;

  trackingCode: string;
}


export interface OrderPayment {
  isPaid: boolean;
}



export interface Order {
  id: string;

  orderNumber: string;

  createdAt: string;

  statusId: number;

  statusTitle: string;

  payment: OrderPayment;

  shipping: OrderShipping;

  customer: OrderCustomer;

  price: OrderPrice;

  items: OrderItem[];
}


export interface Pagination {
  currentPage: number;

  lastPage: number;

  perPage: number;

  total: number;

  from: number;

  to: number;
}
