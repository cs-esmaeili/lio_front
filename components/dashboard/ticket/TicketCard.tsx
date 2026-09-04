'use client';

import Icon from '@/components/global/Icon';
import { ArrowLeft2 } from 'iconsax-reactjs';
import type { Ticket } from '@/components/dashboard/ticket/ticket.model';

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onView }: TicketCardProps) {
  const statusClass =
    ticket.status === 1
      ? 'bg-yellow-100 text-yellow-700'
      : ticket.status === 2
        ? 'bg-green-100 text-green-700'
        : ticket.status === 3
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-200 text-gray-700';

  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 p-5 cursor-pointer" onClick={() => onView(ticket)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="font-medium text-secondary-1">{ticket.title}</span>
          <span className={`rounded-full px-3 py-1 text-xs ${statusClass}`}>{ticket.status_text}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-secondary-2">
          <span>کد پیگیری: {ticket.code}</span>
          <span>تعداد پیام‌ها: {ticket.comments_count}</span>
        </div>

        <span className="text-sm text-secondary-2">{ticket.last_comment}</span>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{ticket.user_name}</span>
          <span>{ticket.created_at}</span>
        </div>
      </div>

      <button type="button" className="rounded-lg p-1 cursor-pointer transition-colors hover:bg-gray-100">
        <Icon IconComponent={ArrowLeft2} className="text-secondary-2" variant="Linear" size={24} />
      </button>
    </div>
  );
}
