import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';

import { AddressSchema, LocationSchema, type Address, type Location } from '@/typescript/schemas/address.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

/* -------------------------------------------------------------------------- */
/*  Response parsing                                                          */
/* -------------------------------------------------------------------------- */

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
function unwrap(body: unknown): unknown {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: unknown }).data;
  }
  return body;
}

async function parseResponse<T>(request: Promise<AxiosResponse>, schema: z.ZodType<T>): Promise<T> {
  const response = await request;

  const parsed = schema.safeParse(unwrap(response.data));
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
}

const OkSchema = z.object({ ok: z.boolean().catch(true) });
export type OkResponse = z.infer<typeof OkSchema>;

/* -------------------------------------------------------------------------- */
/*  Payloads                                                                   */
/* -------------------------------------------------------------------------- */

export interface AddressAddPayload {
  title: string;
  address: string;
  postalCode: string;
  locationId: number;
  isMain?: boolean;
}

export interface AddressEditPayload extends AddressAddPayload {
  address_id: number;
}

/* -------------------------------------------------------------------------- */
/*  Locations — GET /locations                                                 */
/* -------------------------------------------------------------------------- */

export const listLocationsCSR = (): Promise<Location[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/locations`), z.array(LocationSchema));

/* -------------------------------------------------------------------------- */
/*  Addresses — /addresses (always scoped to the current session user)         */
/* -------------------------------------------------------------------------- */

export const listAddressesCSR = (): Promise<Address[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/addresses`), z.array(AddressSchema));

export const addAddressCSR = (payload: AddressAddPayload): Promise<Address> =>
  parseResponse(http.post(`${csrPrefixUrl}/addresses`, payload), AddressSchema);

export const editAddressCSR = ({ address_id, ...payload }: AddressEditPayload): Promise<Address> =>
  parseResponse(http.patch(`${csrPrefixUrl}/addresses/${address_id}`, payload), AddressSchema);

export const setMainAddressCSR = (address_id: number): Promise<Address> =>
  parseResponse(http.patch(`${csrPrefixUrl}/addresses/${address_id}/main`, {}), AddressSchema);

export const removeAddressCSR = (address_id: number): Promise<OkResponse> =>
  parseResponse(http.delete(`${csrPrefixUrl}/addresses/${address_id}`), OkSchema);
