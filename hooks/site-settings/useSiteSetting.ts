'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getSiteSettingCSR } from '@/services/siteSettings.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

/**
 * Owns `GET /site-settings/{key}` — a single setting by key.
 * `enabled` keeps the request lazy so callers can fetch only on demand.
 */
export function useSiteSetting(key: string, enabled = true) {
  const [setting, setSetting] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSetting = useCallback(async (): Promise<SiteSetting | null> => {
    if (!key) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await getSiteSettingCSR(key);
      setSetting(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت تنظیم');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (!enabled || !key) return;
    void fetchSetting();
  }, [enabled, key, fetchSetting]);

  return { setting, loading, error, refetch: fetchSetting } as const;
}
