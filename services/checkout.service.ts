import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import type { OrderInvoiceResponse } from '@/typescript/types/checkout.types';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

export const shippingCost = (address_id: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/shipment/shipping-cost`;
  return http.post(url, { address_id });
};

export const payment = (
  shipping_method_id: number,
  address_id: number,
  wallet_id: number,
  code: string,
  payment_method_id?: number,
): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/payment`;
  return http.post(url, { shipping_method_id, address_id, wallet_id, code, payment_method_id });
};

export const paymentFinal = (
  shipping_method_id: number,
  address_id: number,
  payment_method_id: number,
  wallet_id: number,
  coupon_code: string,
  transaction_file?: File,
): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/payment/pay`;

  if (transaction_file) {
    const formData = new FormData();
    formData.append('shipping_method_id', String(shipping_method_id));
    formData.append('address_id', String(address_id));
    formData.append('payment_method_id', String(payment_method_id));
    formData.append('wallet_id', String(wallet_id));
    formData.append('coupon_code', coupon_code);
    formData.append('transaction_file', transaction_file);
    return http.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  return http.post(url, { shipping_method_id, address_id, payment_method_id, wallet_id, coupon_code });
};

////////////////////////////////////////////////////////////
// SSR - Order Invoice
////////////////////////////////////////////////////////////

export const orderInvoiceSSR = async (code: string, token?: string): Promise<OrderInvoiceResponse> => {
  const url = `${ssrPrefixUrl}/payment/order-invoice`;
  return fetcher<OrderInvoiceResponse>(url, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
