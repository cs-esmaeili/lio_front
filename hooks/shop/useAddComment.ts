'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { addCommentCSR } from '@/services/singelProduct.service';
import type { AddCommentPayload } from '@/services/singelProduct.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useAddComment(barcode: string) {
  const [loading, setLoading] = useState(false);

  const addComment = async (payload: AddCommentPayload) => {
    setLoading(true);
    try {
      const response = await addCommentCSR(barcode, payload);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }
      const message = getApiErrorMessage(error, 'خطا در ثبت نظر.');
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading };
}
