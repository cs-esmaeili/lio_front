'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { removeCommentCSR } from '@/services/singelProduct.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useRemoveComment(barcode: string) {
  const [loading, setLoading] = useState(false);

  const removeComment = async (commentId: number) => {
    setLoading(true);
    try {
      const response = await removeCommentCSR(barcode, commentId);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }
      const message = getApiErrorMessage(error, 'خطا در حذف نظر.');
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { removeComment, loading };
}
