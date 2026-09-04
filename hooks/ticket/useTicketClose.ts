'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ticketCloseCSR } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useTicketClose() {
  const [loading, setLoading] = useState(false);

  const closeTicket = async (ticket_code: string) => {
    setLoading(true);

    try {
      const response = await ticketCloseCSR(ticket_code);
      return response.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(error, 'خطا در بستن تیکت.');

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { closeTicket, loading };
}
