import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { CategoryFiltersSchema } from '@/typescript/schemas/products/category-filters.schema';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';

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
  const url = `${csrPrefixUrl}/categories/${slug}/filters`;
  return http.get(url);
};

// SSR — server-side requests (Next.js server components)
export const productListSSR = async (slug: string | null, urlQuery: string | null): Promise<any> => {
  // TODO: list wiring still in progress — return an empty page shape so the
  // category page can render while only filters are being built.
  return { products: [], product_pagination: null };
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

export const productFiltersSSR = async (
  slug: string,
): Promise<{ filters: CategoryFilterView[]; sort_options: { id: number; key: string; title: string }[] }> => {
  const url = `${ssrPrefixUrl}/categories/${slug}/filters`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = CategoryFiltersSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ فیلترهای دسته‌بندی نامعتبر است', parsed.error);
  }

  return { filters: parsed.data, sort_options: [] };
};
