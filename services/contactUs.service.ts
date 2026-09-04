import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side requests (Next.js server components)
export const contactData = async (): Promise<any> => {
  const url = `${ssrPrefixUrl}/contact-detail`;
  
  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

// name : string, phone:number , subject: string , mobile:number, message:string
export const contactusForm = (formData : any): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/contact-form/save`;

  return http.post(url ,formData);
};
