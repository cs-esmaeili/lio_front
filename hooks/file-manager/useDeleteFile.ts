'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteFileCSR } from '@/services/fileManager.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { FileOk } from '@/typescript/schemas/file-manager.schema';

/** Owns `DELETE /files/{id}` — deletes a single file by its id. */
export function useDeleteFile() {
  const [loading, setLoading] = useState(false);

  const deleteFile = useCallback(async (id: number): Promise<FileOk | null> => {
    setLoading(true);

    try {
      return await deleteFileCSR(id);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف فایل. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFile, loading } as const;
}
