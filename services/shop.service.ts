import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';


const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// CSR — client-side requests (browser)
export const searchCSR = (urlQuery: string): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/search`;

  if (urlQuery) {
    url = `${csrPrefixUrl}/search?${urlQuery}`;
  }

  return http.get(url);
};

export const productFiltersCSR = (_slug: string | null): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/products-filtering`;
  return http.get(url);
};

// SSR — server-side requests (Next.js server components)
export const productListSSR = async (_slug: string, urlQuery: string): Promise<any> => {
  let url = `${ssrPrefixUrl}/search`;

  if (urlQuery) {
    url = `${ssrPrefixUrl}/search?${urlQuery}`;
  }

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const productFiltersSSR = async (_slug: string): Promise<any> => {
  const url = `${ssrPrefixUrl}/products-filtering`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};
