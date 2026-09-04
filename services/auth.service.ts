import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// POST /authentication — send OTP code to phone number
export const sendOtpCSR = (username: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/authentication`;
  return http.post(url, { username });
};

// POST /authentication/check — verify OTP code, returns accessToken
export const checkOtpCSR = (username: string, code: string): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/authentication/check`;
  return http.post(url, {
    code,
    login_method: 'otp',
    username,
  });
};
