import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

// https://panel.fitamana.com/api/product/compare?products%5B1%5D=241753

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// CSR — client-side requests (browser)
export const compareCSR = (products: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/product/compare?${products}`;
  return http.get(url);
};

// SSR — server-side requests (Next.js server components)
export const compareSSR = async (products: string): Promise<any> => {
  let url = `${ssrPrefixUrl}/product/compare?${products}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};
