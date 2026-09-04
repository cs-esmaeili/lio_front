'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { addTicketCSR } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useAddTicket() {
  const [loading, setLoading] = useState(false);

  const addTicket = async (data: { part_id: number; order_id: number; title: string; value: string }) => {
    setLoading(true);

    try {
      const response = await addTicketCSR(data);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(error, 'خطا در ثبت تیکت. دوباره تلاش کنید.');

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addTicket, loading };
}
