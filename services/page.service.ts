import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side requests (Next.js server components)

export const pageData = async (slug: string): Promise<any> => {
  const url = `${ssrPrefixUrl}/dynamic-pages/${slug}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};


export const cigaretteProductsSection = async () => {
  const url = `${ssrPrefixUrl}/product-category/cigarette/`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const winstonProductsSection = async () => {
  const url = `${ssrPrefixUrl}/product-category/%D9%88%DB%8C%D9%86%D8%B3%D8%AA%D9%88%D9%86/`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const iranProductsSection = async () => {
  const url = `${ssrPrefixUrl}/search?made_iran=1`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

export const foreginProductsSection = async () => {
  const url = `${ssrPrefixUrl}/search?made_iran=0`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};