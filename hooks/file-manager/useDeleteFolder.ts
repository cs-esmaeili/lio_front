'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteFolderCSR } from '@/services/fileManager.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { FileOk } from '@/typescript/schemas/file-manager.schema';

/** Owns `DELETE /files/folders?path=` — deletes a folder and its contents. */
export function useDeleteFolder() {
  const [loading, setLoading] = useState(false);

  const deleteFolder = useCallback(async (path: string): Promise<FileOk | null> => {
    setLoading(true);

    try {
      return await deleteFolderCSR(path);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف پوشه. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFolder, loading } as const;
}
