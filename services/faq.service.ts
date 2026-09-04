import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// ===============================
// FAQ Questions
// ===============================

type FAQQuestion = {
  title: string;
  description: string;
};

type FAQSeo = {
  robot: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string | null;
};

export type FAQResponse = {
  status: number;
  data: {
    questions: FAQQuestion[];
    seo: FAQSeo;
    breadcrumb: [];
  };
};

export const getFaqData = async (categorySlug?: string): Promise<FAQResponse> => {
  const query = categorySlug ? `?category_slug=${encodeURIComponent(categorySlug)}` : '';

  const url = `${ssrPrefixUrl}/faq-questions${query}`;

  return fetcher<FAQResponse>(url, {
    next: {
      revalidate: 60,
    },
  });
};

// ===============================
// FAQ Categories
// ===============================

type FAQCategory = {
  title: string;
  slug: string;
};

type FAQCategoriesSeo = {
  robot: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string | null;
};

export type FAQCategoriesResponse = {
  status: number;
  data: {
    categories: FAQCategory[];
    seo_field: FAQCategoriesSeo;
  };
};

export const getFaqCategories = async (): Promise<FAQCategoriesResponse> => {
  const url = `${ssrPrefixUrl}/faq-categories`;

  return fetcher<FAQCategoriesResponse>(url, {
    next: {
      revalidate: 60,
    },
  });
};

// name : string, phone:number , subject: string , mobile:number, message:string
export const faqForm = (formData: any): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/faq-form/save`;

  return http.post(url, formData);
};
