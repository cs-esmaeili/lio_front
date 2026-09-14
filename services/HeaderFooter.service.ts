import { cache } from 'react';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { CategoriesResponseSchema } from '@/typescript/schemas/header/menu.schema';
import type { MenuItem } from '@/typescript/schemas/header/menu.schema';

const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;


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

export const categories = cache(async (): Promise<MenuItem[]> => {
  const url = `${ssrPrefixUrl}/categories`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = CategoriesResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ دسته‌بندی‌ها نامعتبر است', parsed.error);
  }

  return parsed.data.data.categories;
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


