'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ticketNewCommentCSR } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useTicketNewComment() {
  const [loading, setLoading] = useState(false);

  const sendComment = async (data: { ticket_code: string; value: string; documents?: File[] }) => {
    setLoading(true);

    try {
      const response = await ticketNewCommentCSR(data);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(error, 'خطا در ثبت پاسخ.');

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendComment, loading };
}
