import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// CSR — client-side requests (browser)
export const searchCSR = (slug: string | null, urlQuery: string): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/categories/${slug}/search`;

  if (urlQuery) {
    url = `${csrPrefixUrl}/categories/${slug}/search?${urlQuery}`;
  }

  return http.get(url);
};

export const productFiltersCSR = (slug: string | null): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/products-filtering?category_slug=${slug}`;
  return http.get(url);
};

// SSR — server-side requests (Next.js server components)
export const productListSSR = async (slug: string | null, urlQuery: string | null): Promise<any> => {
  let url = `${ssrPrefixUrl}/categories/${slug}/search`;

  if (urlQuery) {
    url = `${ssrPrefixUrl}/categories/${slug}/search?${urlQuery}`;
  }

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const productFiltersSSR = async (slug: string): Promise<any> => {
  const url = `${ssrPrefixUrl}/products-filtering?category_slug=${slug}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};
