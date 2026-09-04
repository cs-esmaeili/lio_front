'use client';

import { useEffect, useState, useRef } from 'react';

import { Button } from '@/components/shadcn/button';
import { Textarea } from '@/components/shadcn/textarea';
import { Spinner } from '@/components/shadcn/spinner';

import ReusableModal from '@/components/global/Modal/ReusableModal';

import { useTicketView } from '@/hooks/ticket/useTicketView';
import { useTicketNewComment } from '@/hooks/ticket/useTicketNewComment';
import { useTicketClose } from '@/hooks/ticket/useTicketClose';

import type { Ticket, TicketComment } from '@/components/dashboard/ticket/ticket.model';

interface TicketViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onRefresh?: () => void;
}

export default function TicketViewModal({ open, onOpenChange, ticket, onRefresh }: TicketViewModalProps) {
  const [reply, setReply] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchTicket, loading, ticket: detail } = useTicketView();
  const { sendComment, loading: sendingComment } = useTicketNewComment();
  const { closeTicket, loading: closingTicket } = useTicketClose();

  //--------------------------------------------------------

  useEffect(() => {
    if (open && ticket) {
      fetchTicket(ticket.code);
      setReply('');
      setFiles([]);
    }
  }, [open, ticket]);

  //--------------------------------------------------------

  const handleClose = () => {
    onOpenChange(false);
  };

  //--------------------------------------------------------

  const handleSubmitReply = async () => {
    if (!reply.trim() || !ticket) return;

    const result = await sendComment({
      ticket_code: ticket.code,
      value: reply,
      documents: files.length > 0 ? files : undefined,
    });

    if (result) {
      setReply('');
      setFiles([]);
      fetchTicket(ticket.code);
      onRefresh?.();
    }
  };

  //--------------------------------------------------------

  const handleCloseTicket = async () => {
    if (!ticket) return;

    const result = await closeTicket(ticket.code);
    if (result) {
      fetchTicket(ticket.code);
      onRefresh?.();
    }
  };

  //--------------------------------------------------------

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  //--------------------------------------------------------

  const statusClass =
    detail?.status === 1
      ? 'bg-yellow-100 text-yellow-700'
      : detail?.status === 2
        ? 'bg-green-100 text-green-700'
        : detail?.status === 3
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-200 text-gray-700';

  const isBusy = sendingComment || closingTicket;

  //--------------------------------------------------------

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-12" onClick={handleClose} disabled={isBusy}>
          بستن
        </Button>

        {detail && detail.status !== 4 && (
          <Button variant="outline" className="h-12 text-red-500 hover:bg-red-50" onClick={handleCloseTicket} disabled={isBusy}>
            {closingTicket ? 'در حال بستن...' : 'بستن تیکت'}
          </Button>
        )}
      </div>

      {detail && detail.status !== 4 && (
        <Button className="h-12 flex-1 max-w-[200px]" onClick={handleSubmitReply} disabled={isBusy || !reply.trim()}>
          {sendingComment ? 'در حال ارسال...' : 'ارسال پاسخ'}
        </Button>
      )}
    </div>
  );

  //--------------------------------------------------------

  return (
    <ReusableModal
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
          return;
        }
        onOpenChange(true);
      }}
      title="جزئیات تیکت"
      footer={footer}
      size="xl"
    >
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center p-20">
          <Spinner className="size-8 text-primary-1" />
        </div>
      )}

      {/* Detail */}
      {!loading && detail && (
        <div className="flex flex-col gap-6">
          {/* Ticket Info */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b py-4">
              <InfoItem title="عنوان" value={detail.title} />
              <InfoItem title="کد پیگیری" value={detail.code} />
              <InfoItem title="بخش" value={detail.part_name ?? String(detail.part_id)} />
              <InfoItem title="تاریخ ثبت" value={detail.created_at} />

              <div className="flex flex-row gap-1">
                <span className="text-sm text-gray-500">وضعیت</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${statusClass}`}>{detail.status_text}</span>
              </div>

              <InfoItem title="تعداد پیام‌ها" value={String(detail.comments.length)} />
              <InfoItem title="سفارش" value={detail.order ? `#${detail.order.code}` : '-'} />
            </div>
          </div>

          {/* Comments */}
          {detail.comments.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-medium text-secondary-1">پیام‌ها</h4>

              {detail.comments.map((comment) => (
                <CommentBubble key={comment.id} comment={comment} />
              ))}
            </div>
          )}

          {/* Reply */}
          {detail.status !== 4 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-secondary-1">پاسخ شما</label>

              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="min-h-[140px]"
                placeholder="پاسخ خود را بنویسید..."
              />

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  پیوست فایل
                </Button>

                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

                {files.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {files.length} فایل انتخاب شد
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </ReusableModal>
  );
}


function InfoItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-row gap-1">
      <span className="text-sm text-gray-400">{title}</span>
      <span className="text-secondary-1">{value}</span>
    </div>
  );
}


function CommentBubble({ comment }: { comment: TicketComment }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-secondary-1">{comment.user_name}</span>
        <span className="text-xs text-gray-400">{comment.created_at}</span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-7 text-secondary-2">{comment.value}</p>

      {comment.files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {comment.files.map((file, idx) => (
            <a
              key={idx}
              href={file.src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-gray-100 px-3 py-1 text-xs text-primary-1 underline"
            >
              {file.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
