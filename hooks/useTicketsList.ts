'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ticketsList } from '@/services/ticket.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import type { Ticket, TicketPagination } from '@/components/dashboard/ticket/ticket.model';

export function useTicketsList() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<TicketPagination | null>(null);

  const fetchTickets = useCallback(async (page: number = 1) => {
    setLoading(true);

    try {
      const response = await ticketsList(page);
      const body = response.data;

      setTickets(body.data ?? []);
      setPagination(body.links ?? null);

      return response;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(
        error,
        'در دریافت لیست تیکت‌ها خطایی به وجود آمد',
      );

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchTickets, loading, tickets, pagination };
}
