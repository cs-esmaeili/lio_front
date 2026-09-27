'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { uploadFilesCSR } from '@/services/fileManager.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { FILE_UPLOAD_MAX_FILES, FILE_UPLOAD_MAX_SIZE } from '@/typescript/schemas/file-manager.schema';
import { fromUploadedFile, formatFileSize, type SelectedFile } from '@/components/admin/file-manager/file-manager.model';

/**
 * Owns `POST /files/upload` — validates the client-side constraints that the
 * backend enforces (max 20 files, 10 MB each) and reports upload progress.
 */
export function useUploadFiles() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (path: string, files: File[]): Promise<SelectedFile[] | null> => {
    if (!files.length) return [];

    if (files.length > FILE_UPLOAD_MAX_FILES) {
      toast.error(`حداکثر ${FILE_UPLOAD_MAX_FILES} فایل در هر بار آپلود امکان‌پذیر است.`);
      return null;
    }

    const oversized = files.find((file) => file.size > FILE_UPLOAD_MAX_SIZE);
    if (oversized) {
      toast.error(`حجم فایل «${oversized.name}» بیش از ${formatFileSize(FILE_UPLOAD_MAX_SIZE)} است.`);
      return null;
    }

    setLoading(true);
    setProgress(0);

    try {
      const uploaded = await uploadFilesCSR(path, files, { onProgress: (event) => setProgress(event.percent) });
      return uploaded.map(fromUploadedFile);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در آپلود فایل‌ها. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  return { upload, loading, progress } as const;
}
