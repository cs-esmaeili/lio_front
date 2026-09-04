'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ticketViewCSR } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import type { TicketDetail } from '@/components/dashboard/ticket/ticket.model';

export function useTicketView() {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);

  const fetchTicket = async (ticket_code: string) => {
    setLoading(true);

    try {
      const response = await ticketViewCSR(ticket_code);
      const body = response.data;

      setTicket(body.data ?? body);
      return body.data ?? body;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(error, 'خطا در دریافت جزئیات تیکت.');

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchTicket, loading, ticket };
}
