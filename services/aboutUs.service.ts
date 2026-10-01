import { cache } from 'react';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { AboutSectionSchema, type AboutData } from '@/typescript/schemas/about/about-section.schema';

const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side request (Next.js server component)
export const aboutData = cache(async (): Promise<AboutData> => {
  const url = `${ssrPrefixUrl}/page-sections/section?location=ABOUT`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = AboutSectionSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ صفحه درباره ما نامعتبر است', parsed.error);
  }

  return parsed.data;
});
