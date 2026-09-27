'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSiteSettingCSR } from '@/services/siteSettings.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/** Owns `DELETE /site-settings/{key}` — deletes a setting by key. */
export function useDeleteSiteSetting() {
  const [loading, setLoading] = useState(false);

  const deleteSetting = useCallback(async (key: string): Promise<boolean> => {
    if (!key) return false;

    setLoading(true);

    try {
      await deleteSiteSettingCSR(key);
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;

      toast.error(getApiErrorMessage(error, 'خطا در حذف تنظیم. دوباره تلاش کنید.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSetting, loading } as const;
}
