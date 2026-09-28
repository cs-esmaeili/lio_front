import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT;

export const personalInfo = (): Promise<AxiosResponse> => {
  return http.get(`${csrPrefixUrl}/profile/personal-info`);
};
