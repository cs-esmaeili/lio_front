'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { partsListCSR } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export interface Part {
  id: number;
  title: string;
}

export function usePartsList() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);

    partsListCSR()
      .then((response) => {
        if (abortController.signal.aborted) return;
        setParts(response.data?.data ?? response.data ?? []);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;

        if (isApiError(error) && error.handled) {
          return;
        }

        const message = getApiErrorMessage(error, 'خطا در دریافت لیست بخش‌ها.');

        toast.error(message);
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return { parts, loading };
}
