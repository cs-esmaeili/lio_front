import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// CSR — client-side requests (browser)
// GET /attributes — full list of filterable attributes/values for sigaretobesaz
// export const sigaretobesazAttributesCSR = (): Promise<AxiosResponse> => {
//   const url = `${csrPrefixUrl}/attributes`;
//   return http.get(url);
// };

export const sigaretobesazAttributesCSR = (): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/products-filtering?category_slug=cigarette`;
  return http.get(url);
};

// GET /search?attributes[0][attribute_id]=..&attributes[0][values][]=.. — dedicated
// search endpoint for sigaretobesaz, driven entirely by selected attribute values.
export const sigaretobesazSearchCSR = (attributesQuery: string): Promise<AxiosResponse> => {
  let url = `${csrPrefixUrl}/search`;

  if (attributesQuery) {
    url = `${csrPrefixUrl}/search?${attributesQuery}`;
  }

  return http.get(url);
};