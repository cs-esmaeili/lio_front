import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';
import type { ProductSortOption } from '@/typescript/schemas/products/product-options.schema';
import { ProductSearchConfigSchema } from '@/typescript/schemas/products/search-config.schema';
import { ProductSearchResponseSchema } from '@/typescript/schemas/products/product-search.schema';
import type { ProductSearchItem } from '@/typescript/schemas/products/product-search.schema';
import type { Pagination } from '@/typescript/schemas/pagination.schema';
import { buildProductSearchBody } from '@/utils/product/buildProductSearchBody';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

type ProductSearchResult = {
  products: ProductSearchItem[];
  product_pagination: Pagination;
};

type ProductFiltersResult = {
  filters: CategoryFilterView[];
  sort_options: ProductSortOption[];
};

const parseProductSearch = (data: unknown): ProductSearchResult => {
  const parsed = ProductSearchResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ جستجوی محصولات نامعتبر است', parsed.error);
  }

  return parsed.data;
};

const parseProductSearchConfig = (data: unknown): ProductFiltersResult => {
  const parsed = ProductSearchConfigSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ تنظیمات جستجوی محصولات نامعتبر است', parsed.error);
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

/**
 * `categorySlug` is optional: pass the category slug to scope the search to a
 * category, or `null`/`''` to search the whole catalogue (shop page).
 */
const searchConfigQuery = (slug: string | null): string =>
  slug ? `?categorySlug=${encodeURIComponent(slug)}` : '';

// CSR — client-side requests (browser)

export const productSearchCSR = async (slug: string | null, urlQuery: string): Promise<ProductSearchResult> => {
  const body = buildProductSearchBody(slug, new URLSearchParams(urlQuery));
  const response = await http.post(`${csrPrefixUrl}/products/search`, body);

  return parseProductSearch(response.data);
};

export const productFiltersCSR = async (slug: string | null): Promise<ProductFiltersResult> => {
  const response = await http.get(`${csrPrefixUrl}/products/search-config${searchConfigQuery(slug)}`);

  return parseProductSearchConfig(response.data);
};

// SSR — server-side requests (Next.js server components)

export const productListSSR = async (
  slug: string | null,
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

export const productFiltersSSR = async (slug: string | null): Promise<ProductFiltersResult> => {
  const data = await fetcher<unknown>(`${ssrPrefixUrl}/products/search-config${searchConfigQuery(slug)}`, {
    next: {
      revalidate: 60,
    },
  });

  return parseProductSearchConfig(data);
};
