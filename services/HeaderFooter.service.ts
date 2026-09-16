import { cache } from 'react';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { CategoriesResponseSchema } from '@/typescript/schemas/header/menu.schema';
import type { MenuItem } from '@/typescript/schemas/header/menu.schema';
import { HeaderSectionSchema } from '@/typescript/schemas/header/header-section.schema';
import type { HeaderData } from '@/typescript/types/header/header.types';

const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;


export const HeaderFooterInfo = cache(async (type: string): Promise<any> => {
  const url = `${ssrPrefixUrl}/page-sections/section?location=${type}`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
});

export const getHeaderData = cache(async (): Promise<HeaderData> => {
  const url = `${ssrPrefixUrl}/page-sections/section?location=HEADER`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = HeaderSectionSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ هدر نامعتبر است', parsed.error);
  }

  return { header: parsed.data.data.data.items };
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


