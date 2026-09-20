import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { CategoryFiltersSchema } from '@/typescript/schemas/products/category-filters.schema';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';
import {
  ProductGlobalFiltersSchema,
  ProductSortOptionsSchema,
} from '@/typescript/schemas/products/product-options.schema';
import type { ProductSortOption } from '@/typescript/schemas/products/product-options.schema';
import { ProductSearchResponseSchema } from '@/typescript/schemas/products/product-search.schema';
import type { ProductSearchItem } from '@/typescript/schemas/products/product-search.schema';
import type { Pagination } from '@/typescript/schemas/pagination.schema';
import { buildProductSearchBody } from '@/utils/product/buildProductSearchBody';

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

// Product search — POST /products/search

type ProductSearchResult = {
  products: ProductSearchItem[];
  product_pagination: Pagination;
};

const parseProductSearch = (data: unknown): ProductSearchResult => {
  const parsed = ProductSearchResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ جستجوی محصولات نامعتبر است', parsed.error);
  }

  return parsed.data;
};

const toParams = (searchParams: Record<string, string | string[]>): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else params.append(key, value);
  });

  return params;
};

export const productSearchCSR = async (slug: string, urlQuery: string): Promise<ProductSearchResult> => {
  const body = buildProductSearchBody(slug, new URLSearchParams(urlQuery));
  const response = await http.post(`${csrPrefixUrl}/products/search`, body);

  return parseProductSearch(response.data);
};

// SSR — server-side requests (Next.js server components)
export const productListSSR = async (
  slug: string,
  searchParams: Record<string, string | string[]>,
): Promise<ProductSearchResult> => {
  const body = buildProductSearchBody(slug, toParams(searchParams));

  const data = await fetcher<unknown>(`${ssrPrefixUrl}/products/search`, {
    method: 'POST',
    body: JSON.stringify(body),
    next: {
      revalidate: 60,
    },
  });

  return parseProductSearch(data);
};

export const productFiltersSSR = async (
  slug: string,
): Promise<{ filters: CategoryFilterView[]; sort_options: ProductSortOption[] }> => {
  const [filtersData, sortOptionsData, globalFiltersData] = await Promise.all([
    fetcher<unknown>(`${ssrPrefixUrl}/categories/${slug}/filters`, {
      next: {
        revalidate: 60,
      },
    }),
    fetcher<unknown>(`${ssrPrefixUrl}/products/sort-options`, {
      next: {
        revalidate: 60,
      },
    }),
    fetcher<unknown>(`${ssrPrefixUrl}/products/global-filters`, {
      next: {
        revalidate: 60,
      },
    }),
  ]);

  const parsed = CategoryFiltersSchema.safeParse(filtersData);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ فیلترهای دسته‌بندی نامعتبر است', parsed.error);
  }

  const sortOptions = ProductSortOptionsSchema.safeParse(sortOptionsData);
  const globalFilters = ProductGlobalFiltersSchema.safeParse(globalFiltersData);

  return {
    filters: [...(globalFilters.success ? globalFilters.data : []), ...parsed.data],
    sort_options: sortOptions.success ? sortOptions.data : [],
  };
};
