import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

type CartItem = {
  variant_id: number;
  product_id: number;
  quantity: number;
};

type AddToCartPayload = {
  product_id: number;
  variant_id: number;
};

type UpdateCartPayload = {
  cart_id: number;
  quantity: number;
};

export const addToCardNoAuth = (items: CartItem[]): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart-details`;

  return http.post(url, { items });
};



export const addToCartMany = (items: CartItem[]): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart/add-cart`;
  return http.post(url, { items });
};

export const addToCart = (payload: AddToCartPayload): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart/add`;
  return http.post(url, payload);
};

export const updateCart = (payload: UpdateCartPayload): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart/update`;
  return http.post(url, payload);
};

export const removeCart = (items: number[]): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart/remove`;
  return http.post(url, { cart_ids : items });
};

export const getCart = (): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/cart`;
  return http.get(url);
};
