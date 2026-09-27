'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createFolderCSR } from '@/services/fileManager.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { CreateFolderResult } from '@/typescript/schemas/file-manager.schema';

/** Owns `POST /files/folders` — creates a folder at the given relative path. */
export function useCreateFolder() {
  const [loading, setLoading] = useState(false);

  const createFolder = useCallback(async (path: string): Promise<CreateFolderResult | null> => {
    const normalized = path.trim().replace(/^\/+|\/+$/g, '');
    if (!normalized) {
      toast.error('نام پوشه را وارد کنید.');
      return null;
    }

    setLoading(true);

    try {
      return await createFolderCSR(normalized);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ایجاد پوشه. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFolder, loading } as const;
}
