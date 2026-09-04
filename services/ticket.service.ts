import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// SSR — server-side requests (Next.js server components)
export const ticketsListSSR = async (page?: number): Promise<any> => {
  const url = `${ssrPrefixUrl}/profile/tickets/?page=${page || 1}`;
  return fetcher(url, {
    next: {
      revalidate: 60,
    },
  });
};

// CSR — client-side requests
export const ticketsList = (page: number = 1): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/tickets/?page=${page}`;
  return http.get(url);
};

export const addTicketCSR = (data: { part_id: number; title: string; value: string }): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/tickets/add`;
  return http.post(url, data);
};

export const partsListCSR = (): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/parts`;
  return http.get(url);
};

export const ticketViewCSR = (ticket_code: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/tickets/view`;
  return http.post(url, { ticket_code });
};

export const ticketNewCommentCSR = (data: { ticket_code: string; value: string; documents?: File[] }): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/tickets/new-comment`;

  if (data.documents && data.documents.length > 0) {
    const formData = new FormData();
    formData.append('ticket_code', data.ticket_code);
    formData.append('value', data.value);
    data.documents.forEach((file) => {
      formData.append('documents[]', file);
    });
    return http.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  return http.post(url, {
    ticket_code: data.ticket_code,
    value: data.value,
  });
};

export const ticketCloseCSR = (ticket_code: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/tickets/close`;
  return http.post(url, { ticket_code });
};

/*

index
/profile/tickets/?page=

[id]
/profile/tickets/view
/profile/tickets/close

new
/profile/tickets/add
/parts

new-comment
/profile/tickets/new-comment

*/
