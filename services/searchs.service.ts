import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import type { SearchResponse } from '@/hooks/useSearch';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// CSR — client-side requests (browser)
export const searchCSR = (query: string): Promise<AxiosResponse<SearchResponse>> => {
  let url = `${csrPrefixUrl}/global-search?search=${query}`;
  return http.get(url);
};