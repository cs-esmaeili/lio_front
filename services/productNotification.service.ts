import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

export const productNotificationCSR = (
  barcode: string,
  variantId: number
): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/product/${barcode}/notification?variant_id=${variantId}`;

  return http.get(url);
};

export const addProductNotificationCSR = (
  barcode: string,
  variantId: number,
  types: string[]
): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/product/${barcode}/notification/add`;

  return http.post(url, {
    type: types,
    product_price_id: variantId,
  });
};

export const removeProductNotificationCSR = (
  barcode: string,
  variantId: number
): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/product/${barcode}/notification/remove`;

  return http.post(url, {
    product_price_id: variantId,
  });
};