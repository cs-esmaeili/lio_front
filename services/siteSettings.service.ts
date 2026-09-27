import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  SiteSettingListSchema,
  SiteSettingOkSchema,
  SiteSettingSchema,
  type SiteSetting,
} from '@/typescript/schemas/site-setting.schema';

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

/* -------------------------------------------------------------------------- */
/*  Site settings — /site-settings, /site-settings/{key}                      */
/* -------------------------------------------------------------------------- */

export interface UpsertSiteSettingPayload {
  data: Record<string, unknown>;
  isPrivate?: boolean;
}

/** GET /site-settings — every setting (requires `site:manage`). */
export const listSiteSettingsCSR = (): Promise<SiteSetting[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/site-settings`), SiteSettingListSchema);

/** GET /site-settings/{key} — a single setting by key. */
export const getSiteSettingCSR = (key: string): Promise<SiteSetting> =>
  parseResponse(http.get(`${csrPrefixUrl}/site-settings/${encodeURIComponent(key)}`), SiteSettingSchema);

/** PUT /site-settings/{key} — create or update a setting by key. */
export const upsertSiteSettingCSR = (key: string, payload: UpsertSiteSettingPayload): Promise<SiteSetting> =>
  parseResponse(http.put(`${csrPrefixUrl}/site-settings/${encodeURIComponent(key)}`, payload), SiteSettingSchema);

/** DELETE /site-settings/{key} — delete a setting by key. */
export const deleteSiteSettingCSR = (key: string): Promise<{ ok: boolean }> =>
  parseResponse(http.delete(`${csrPrefixUrl}/site-settings/${encodeURIComponent(key)}`), SiteSettingOkSchema);
