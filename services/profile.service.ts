import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';

import { ProfileSchema, type Profile, type UpdateProfileInput } from '@/typescript/schemas/profile.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

/* -------------------------------------------------------------------------- */
/*  Response parsing                                                          */
/* -------------------------------------------------------------------------- */

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
function unwrap(body: unknown): unknown {
  if (typeof body === 'object' && body !== null && 'data' in body) {
    return body.data;
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

/* -------------------------------------------------------------------------- */
/*  Profile — /profile (always scoped to the current session user)             */
/* -------------------------------------------------------------------------- */

export const getProfileCSR = (): Promise<Profile> => parseResponse(http.get(`${csrPrefixUrl}/profile`), ProfileSchema);

export const updateProfileCSR = (payload: UpdateProfileInput): Promise<Profile> =>
  parseResponse(http.patch(`${csrPrefixUrl}/profile`, payload), ProfileSchema);

/* -------------------------------------------------------------------------- */
/*  Mobile phone — legacy flow                                                */
/* -------------------------------------------------------------------------- */

export interface UpdateMobilePhonePayload {
  mobile: string;
}

export interface ConfirmCodePayload {
  code: string;
}

/** Step 1: Submit new mobile number */
export const updateMobilePhone = (data: UpdateMobilePhonePayload): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/mobile-phone/update`, data);
};

/** Step 2: Send OTP code to current phone */
export const sendCurrentPhoneCode = (): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/mobile-phone/update/current-phone/send-code`);
};

/** Step 3: Verify OTP code on current phone */
export const confirmCurrentPhoneCode = (data: ConfirmCodePayload): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/mobile-phone/update/current-phone/confirm-code`, data);
};

/** Step 4: Verify OTP code on new phone and finalize update */
export const confirmNewPhoneCode = (data: ConfirmCodePayload): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/mobile-phone/update/confirm-phone`, data);
};

/* -------------------------------------------------------------------------- */
/*  Occupations — legacy                                                      */
/* -------------------------------------------------------------------------- */

export interface Occupation {
  id: number;
  title: string;
}

export const getOccupations = (): Promise<AxiosResponse> => {
  return http.get(`${csrPrefixUrl}/occupations`);
};
