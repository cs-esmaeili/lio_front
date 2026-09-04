import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { cache } from 'react';
import { fetcher } from '@/services/core/SSRService';

const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;
const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;


// SSR — server-side requests (Next.js server components)
// cache() ensures single call per unique args per request, even across multiple layouts
export const HeaderFooterInfo = cache(async (type: string): Promise<any> => {
  const url = `${ssrPrefixUrl}/menu-options?type=${type}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
});

export const categories = cache(async (): Promise<any> => {
  const url = `${ssrPrefixUrl}/categories`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
});

export const searchCategories = cache(
  async (search?: string): Promise<any> => {
    const url = search
      ? `${ssrPrefixUrl}/categories/search?search=${encodeURIComponent(search)}`
      : `${ssrPrefixUrl}/categories/search`;

    return fetcher(url, {
      next: {
        revalidate: 60,
      },
    });
  }
);


