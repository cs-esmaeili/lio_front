'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { upsertSiteSettingCSR, type UpsertSiteSettingPayload } from '@/services/siteSettings.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { SITE_SETTING_KEY_PATTERN, type SiteSetting } from '@/typescript/schemas/site-setting.schema';

/** Owns `PUT /site-settings/{key}` — creates or updates a setting. */
export function useUpsertSiteSetting() {
  const [loading, setLoading] = useState(false);

  const upsertSetting = useCallback(async (key: string, payload: UpsertSiteSettingPayload): Promise<SiteSetting | null> => {
    const normalized = key.trim();

    if (!normalized) {
      toast.error('کلید تنظیم را وارد کنید.');
      return null;
    }
    if (!SITE_SETTING_KEY_PATTERN.test(normalized)) {
      toast.error('کلید فقط می‌تواند شامل حروف انگلیسی، عدد، «-» و «_» باشد.');
      return null;
    }

    setLoading(true);

    try {
      return await upsertSiteSettingCSR(normalized, payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره تنظیم. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upsertSetting, loading } as const;
}
