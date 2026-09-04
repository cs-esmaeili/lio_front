import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side requests (Next.js server components)
export const aboutData = async (): Promise<any> => {
  const url = `${ssrPrefixUrl}/about-items`;
  
  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};