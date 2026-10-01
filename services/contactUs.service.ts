import { cache } from 'react';
import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { ContactSectionSchema, type ContactData } from '@/typescript/schemas/contact/contact-section.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side request (Next.js server component)
export const contactData = cache(async (): Promise<ContactData> => {
  const url = `${ssrPrefixUrl}/page-sections/section?location=CONTACT`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = ContactSectionSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ صفحه تماس نامعتبر است', parsed.error);
  }

  return parsed.data;
});

// CSR — contact form submission
export const contactusForm = (formData: { name: string; phone: string; message: string }): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/contact-form/save`;

  return http.post(url, formData);
};
