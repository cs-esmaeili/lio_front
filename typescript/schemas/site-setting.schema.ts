import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Site settings contract — /site-settings                                   */
/* -------------------------------------------------------------------------- */

/** A site setting as returned by the API. `data` is an arbitrary JSON object. */
export const SiteSettingSchema = z.object({
  key: z.string(),
  data: z.record(z.string(), z.unknown()).catch({}),
  isPrivate: z.boolean().catch(false),
});

/** `GET /site-settings` returns the settings as an array. */
export const SiteSettingListSchema = z.array(SiteSettingSchema);

/** `data` of `DELETE /site-settings/{key}`. */
export const SiteSettingOkSchema = z.object({
  ok: z.boolean().catch(true),
});

export type SiteSetting = z.infer<typeof SiteSettingSchema>;

/** Keys travel in the URL path, so they must be a safe single segment. */
export const SITE_SETTING_KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;
