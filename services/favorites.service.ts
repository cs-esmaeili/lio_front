import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;


export const getFavoritesCSR = (page: number = 1): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/favorites?page=${page}`;
  return http.get(url);
};

export const addFavoriteCSR = (barcode: string, productId: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/favorites/${barcode}/add`;
  return http.post(url, { product_id: productId });
};

export const removeFavoriteCSR = (barcode: string, productId: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/favorites/${barcode}/remove`;
  return http.post(url, { product_id: productId });
};

