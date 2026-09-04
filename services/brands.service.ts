import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// CSR — client-side requests (browser)
export const brandsListCSR = (page: number): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/brands?page=${page}`;
  return http.get(url);
};

export const brandsShopListCSR = (slug: string, query: string): Promise<AxiosResponse> => {
  let url = `${ssrPrefixUrl}/brands/${slug}/search?${query}`;
  return http.get(url);
};

export const brandsShopListFilterCSR = (slug: string): Promise<AxiosResponse> => {
  let url = `${ssrPrefixUrl}/products-filtering?brand_slug=${slug}`;
  return http.get(url);
};

// SSR — server-side requests (Next.js server components)
export const brandsListSSR = async (page: number): Promise<any> => {
  let url = `${ssrPrefixUrl}/brands?page=${page}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const brandsShopListSSR = async (slug: string, query: string): Promise<any> => {
  let url = `${ssrPrefixUrl}/brands/${slug}/search?${query}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const brandsShopListFilterSSR = async (slug: string): Promise<any> => {
  let url = `${ssrPrefixUrl}/products-filtering?brand_slug=${slug}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};
