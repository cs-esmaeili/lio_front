'use client';

import { useState } from 'react';

import { Button } from '@/components/shadcn/button';

import ReusableModal from '@/components/global/Modal/ReusableModal';

import TicketForm from '@/components/dashboard/ticket/TicketForm';

import { useAddTicket } from '@/hooks/ticket/useAddTicket';

import type { TicketFormValues } from '@/typescript/schemas/ticket-form.schema';

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function TicketModal({ open, onOpenChange, onSuccess }: TicketModalProps) {
  const { addTicket, loading } = useAddTicket();
  const [formKey, setFormKey] = useState(0);

  //--------------------------------------------------------

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      // force TicketForm remount to reset react-hook-form state
      setFormKey((k) => k + 1);
    }

    onOpenChange(value);
  };

  //--------------------------------------------------------

  const handleSubmit = async (data: TicketFormValues) => {
    const result = await addTicket({
      part_id: Number(data.part_id),
      order_id: Number(data.order_id),
      title: data.title,
      value: data.message,
    });

    if (result) {
      handleOpenChange(false);
      onSuccess?.();
    }
  };

  //--------------------------------------------------------

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" className="h-12 basis-1/3" onClick={() => handleOpenChange(false)} disabled={loading}>
        انصراف
      </Button>

      <Button type="submit" form="ticket-form" className="h-12 basis-2/3" disabled={loading}>
        {loading ? 'در حال ارسال...' : 'ارسال تیکت'}
      </Button>
    </div>
  );

  //--------------------------------------------------------

  return (
    <ReusableModal open={open} onOpenChange={handleOpenChange} title="ثبت تیکت جدید" footer={footer} size="lg">
      <TicketForm key={formKey} onSubmit={handleSubmit} />
    </ReusableModal>
  );
}
