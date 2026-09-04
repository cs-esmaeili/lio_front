import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// CSR — client-side requests (browser)
export const postListCSR = (page: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/v2/blog/posts?page=${page}&per_page=13`;
  return http.get(url);
};

export const singlePost = (slug: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/v2/blog/posts/${slug}`;
  return http.get(url);
};


export const socialNetworks = (): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/social-networks`;
  return http.get(url);
};


// SSR — server-side requests (Next.js server components)
export const postListSSR = async (page: number): Promise<any> => {
  const url = `${ssrPrefixUrl}/v2/blog/posts?page=${page}&per_page=13`;

  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};
