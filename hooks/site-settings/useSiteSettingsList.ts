'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listSiteSettingsCSR } from '@/services/siteSettings.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

/** Owns `GET /site-settings` — the full settings list. */
export function useSiteSettingsList(enabled = true) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (): Promise<SiteSetting[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const list = await listSiteSettingsCSR();
      setSettings(list);
      return list;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت تنظیمات سایت');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchSettings();
  }, [enabled, fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings } as const;
}
