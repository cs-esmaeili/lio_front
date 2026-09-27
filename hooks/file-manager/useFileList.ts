'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listFilesCSR } from '@/services/fileManager.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { FileEntry } from '@/typescript/schemas/file-manager.schema';

/**
 * Owns `GET /files?path=` — the directory listing for the given `path`.
 * `enabled` keeps the request lazy so a dialog only fetches while it is open.
 */
export function useFileList(path: string, enabled = true) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async (): Promise<FileEntry[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const listing = await listFilesCSR(path);
      setEntries(listing.entries);
      return listing.entries;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت لیست فایل‌ها');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!enabled) return;
    void fetchList();
  }, [enabled, fetchList]);

  return { entries, loading, error, refetch: fetchList } as const;
}
