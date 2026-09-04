export interface Ticket {
  id: number;
  part_id: number;
  code: string;
  title: string;
  last_comment: string;
  user_name: string;
  status: number;
  status_text: string;
  comments_count: number;
  created_at: string;
}

export interface TicketCommentFile {
  src: string;
  title: string;
}

export interface TicketComment {
  id: number;
  user_id: number;
  user_name: string;
  value: string;
  is_read: boolean;
  files: TicketCommentFile[];
  created_at: string;
}

export interface TicketOrder {
  id: number;
  code: number;
  status: number;
  status_text: string;
  final_amount: number;
}

export interface TicketDetail extends Ticket {
  creator_id: number;
  part_name: string;
  order_id: number;
  order: TicketOrder | null;
  comments: TicketComment[];
}

export type TicketMessageSender = 'user' | 'admin';

export interface TicketMessage {
  id: string;
  sender: TicketMessageSender;
  message: string;
  createdAt: string;
  attachment?: string | null;
}

export interface TicketPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export const TICKET_STATUS: Record<number, string> = {
  1: 'در انتظار پاسخ',
  2: 'پاسخ داده شده',
  3: 'در حال بررسی',
  4: 'بسته شده',
};
