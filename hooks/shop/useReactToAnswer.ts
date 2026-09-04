'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { reactToAnswerCSR } from '@/services/singelProduct.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useReactToAnswer() {
  const [loading, setLoading] = useState(false);

  const reactToAnswer = async (answerId: number, type: 'like' | 'dislike') => {
    setLoading(true);
    try {
      const response = await reactToAnswerCSR(answerId, type);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }
      const message = getApiErrorMessage(error, 'خطا در ثبت واکنش.');
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { reactToAnswer, loading };
}
