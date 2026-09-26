'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { ApiError } from '@/utils/api-error';
import { useCsrf } from '@/hooks/useCsrf';
import { getMeCSR, logoutCSR, requestOtpCSR, verifyOtpCSR } from '@/services/auth.service';
import {
  AuthEnvelopeSchema,
  AuthErrorBodySchema,
  AuthUserSchema,
  LogoutSchema,
  MeSchema,
  OtpRequestSchema,
  type AuthUser,
  type Me,
  type OtpRequest,
} from '@/typescript/schemas/auth.schema';

/* -------------------------------------------------------------------------- */
/*  Response handling                                                         */
/* -------------------------------------------------------------------------- */

function extractMessage(body: unknown): string {
  const parsed = AuthErrorBodySchema.safeParse(body);
  if (parsed.success) {
    if (parsed.data.message) return parsed.data.message;
    if (parsed.data.details?.length) {
      return parsed.data.details.map((detail) => detail.message).join('، ');
    }
  }
  return 'درخواست با خطا مواجه شد';
}

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
async function parseAuthResponse<T>(res: Response, schema: z.ZodType<T>): Promise<T> {
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(body), body);
  }

  const envelope = AuthEnvelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', envelope.error);
  }

  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Builds auth requests: CSRF header on mutations, then parses the
 * `{ statusCode, data, message }` envelope into the auth contract types.
 */
export function useAuthRequest() {
  const { ensureCsrfToken } = useCsrf();

  const buildHeaders = useCallback(async (): Promise<Headers> => {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const csrf = await ensureCsrfToken();
    if (csrf) headers.set('X-CSRF-Token', csrf);
    return headers;
  }, [ensureCsrfToken]);

  const getMe = useCallback(async (): Promise<Me> => parseAuthResponse(await getMeCSR(), MeSchema), []);

  const requestOtp = useCallback(
    async (username: string): Promise<OtpRequest> => {
      const headers = await buildHeaders();
      return parseAuthResponse(await requestOtpCSR(username, headers), OtpRequestSchema);
    },
    [buildHeaders],
  );

  const verifyOtp = useCallback(
    async (username: string, code: string): Promise<AuthUser> => {
      const headers = await buildHeaders();
      return parseAuthResponse(await verifyOtpCSR(username, code, headers), AuthUserSchema);
    },
    [buildHeaders],
  );

  const logout = useCallback(async (): Promise<void> => {
    const headers = await buildHeaders();
    await parseAuthResponse(await logoutCSR(headers), LogoutSchema);
  }, [buildHeaders]);

  return { getMe, requestOtp, verifyOtp, logout } as const;
}
