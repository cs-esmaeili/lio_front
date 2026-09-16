import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side requests (Next.js server components)
export const homeSections = async (): Promise<any> => {
  const url = `${ssrPrefixUrl}/home`;
  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

// SSR — new page-sections structure for the home page
export const homePageSections = async (): Promise<any> => {
  const url = `${ssrPrefixUrl}/page-sections/page?entityType=HOME`;
  const res = await fetcher<any>(url, {
    next: {
      revalidate: 60,
    },
  });
  return res?.data;
};


export const favoriteProductSectionTab = (sectionId: number, slug: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/sections/index/view/${sectionId}/${slug}`;
  return http.get(url);
};
