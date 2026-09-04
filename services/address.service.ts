import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

import type { Address } from '@/components/dashboard/address/address.model';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

export interface PlaceItem {
  id: number;
  title: string;
}

export interface AddressListItem {
  id: number;
  province_id: number;
  city_id: number;
  city: string;
  title: string;
  postal_code: number | string;
  recipient_name: string | null;
  recipient_mobile: string | null;
  is_default_recipient: boolean;
  value: string;
  lat: number | string;
  lng: number | string;
  name_family: string | null;
}

// GET /profile/addresses
export const listAddressesCSR = (): Promise<AxiosResponse<AddressListItem[] | { data: AddressListItem[] }>> => {
  const url = `${csrPrefixUrl}/profile/addresses`;
  return http.get(url);
};

export const extractAddressId = (body: unknown): number | undefined => {
  const data = (body as { data?: unknown } | null | undefined)?.data ?? body;
  const record = data as { id?: unknown; address_id?: unknown } | null | undefined;
  const n = Number(record?.id ?? record?.address_id);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export const mapAddressListItem = (row: AddressListItem): Address => ({
  id: String(row.id),
  lat: typeof row.lat === 'string' ? Number(row.lat) : row.lat,
  lng: typeof row.lng === 'string' ? Number(row.lng) : row.lng,
  province_id: row.province_id,
  place_id: row.city_id,
  province: '',
  city: row.city,
  title: row.title ?? '',
  postalCode: row.postal_code != null ? String(row.postal_code) : '',
  address: row.value ?? '',
  receiverType: row.is_default_recipient ? 'self' : 'other',
  receiverName: row.recipient_name ?? '',
  receiverPhone: row.recipient_mobile ?? '',
  name_family: row.name_family ?? '',
});

interface PlacesResponse {
  status: number;
  data: PlaceItem[];
  show_map?: string;
}

// GET /places  (provinces)
export const getProvincesCSR = (): Promise<AxiosResponse<PlacesResponse>> => {
  const url = `${csrPrefixUrl}/places`;
  return http.get(url);
};

// GET /places?province_id=X  (cities of a province)
export const getCitiesCSR = (province_id: number): Promise<AxiosResponse<PlacesResponse>> => {
  const url = `${csrPrefixUrl}/places`;
  return http.get(url, { params: { province_id } });
};

export interface AddressAddPayload {
  lat: number | string;
  lng: number | string;
  place_id: number;
  province_id: number;
  title: string;
  postal_code: string;
  value: string;
  is_default_recipient: '0' | '1';
  recipient_name?: string | null;
  recipient_mobile?: string | null;
  name_family: string;
}

export interface AddressEditPayload extends AddressAddPayload {
  address_id: number;
}

// POST /profile/addresses/add
export const addAddressCSR = (payload: AddressAddPayload): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/addresses/add`;
  return http.post(url, payload);
};

// POST /profile/addresses/edit
export const editAddressCSR = (payload: AddressEditPayload): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/addresses/edit`;
  return http.post(url, payload);
};

// POST /profile/addresses/remove
export const removeAddressCSR = (address_id: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/addresses/remove`;
  return http.post(url, { address_id });
};
