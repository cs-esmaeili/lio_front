'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listAttributesCSR } from '@/services/attribute.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAttribute } from '@/typescript/schemas/attribute.schema';

interface UseAttributeListOptions {
  /** Skip the initial fetch while a dialog is closed. Defaults to `true`. */
  enabled?: boolean;
}

/** Owns `GET /admin/attributes`. */
export function useAttributeList({ enabled = true }: UseAttributeListOptions = {}) {
  const [attributes, setAttributes] = useState<AdminAttribute[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<AdminAttribute[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const list = await listAttributesCSR();
      setAttributes(list);
      return list;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }
      const message = getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌ها');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    // The first `await` keeps these updates out of the synchronous effect body.
    void (async () => {
      try {
        const list = await listAttributesCSR();
        if (!active) return;
        setAttributes(list);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        if (isApiError(requestError) && requestError.handled) {
          setError(requestError.message);
          return;
        }
        const message = getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌ها');
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

  return { attributes, loading, error, refetch } as const;
}
