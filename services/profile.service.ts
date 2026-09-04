import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT;

// ─── Types ───────────────────────────────────────────────

export interface UpdateNameNationalCodePayload {
  name: string;
  last_name: string;
  national_code: string;
}

export interface UpdateEmailPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  password: string;
  password_confirmation: string;
  current_password?: string;
}

export interface UpdateBirthdayPayload {
  birth_year: number;
  birth_month: number;
  birth_day: number;
}

export interface UpdateOccupationPayload {
  occupation_id: number;
}

export interface UpdateMobilePhonePayload {
  mobile: string;
}

export interface ConfirmCodePayload {
  code: string;
}

export interface Occupation {
  id: number;
  title: string;
}

export interface UpdateProfilePayload {
  name?: string;
  last_name?: string;
  national_code?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  birth_year?: string;
  birth_month?: string;
  birth_day?: string;
}

// ─── Personal Info ──────────────────────────────────────

export const getPersonalInfo = (): Promise<AxiosResponse> => {
  return http.get(`${csrPrefixUrl}/profile/personal-info`);
};

// ─── Update Profile ─────────────────────────────────────

/**
 * Update user profile fields by type.
 * Types: name-national-code | email | password | birthday | occupation
 */


export const updateProfile = (
  data: UpdateProfilePayload,
): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/update`, data);
};

// ─── Mobile Phone ───────────────────────────────────────

/** Step 1: Submit new mobile number */
export const updateMobilePhone = (
  data: UpdateMobilePhonePayload,
): Promise<AxiosResponse> => {
  return http.post(`${csrPrefixUrl}/profile/mobile-phone/update`, data);
};

/** Step 2: Send OTP code to current phone */
export const sendCurrentPhoneCode = (): Promise<AxiosResponse> => {
  return http.post(
    `${csrPrefixUrl}/profile/mobile-phone/update/current-phone/send-code`,
  );
};

/** Step 3: Verify OTP code on current phone */
export const confirmCurrentPhoneCode = (
  data: ConfirmCodePayload,
): Promise<AxiosResponse> => {
  return http.post(
    `${csrPrefixUrl}/profile/mobile-phone/update/current-phone/confirm-code`,
    data,
  );
};

/** Step 4: Verify OTP code on new phone and finalize update */
export const confirmNewPhoneCode = (
  data: ConfirmCodePayload,
): Promise<AxiosResponse> => {
  return http.post(
    `${csrPrefixUrl}/profile/mobile-phone/update/confirm-phone`,
    data,
  );
};

// ─── Occupations ────────────────────────────────────────

export const getOccupations = (): Promise<AxiosResponse> => {
  return http.get(`${csrPrefixUrl}/occupations`);
};
