'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { ORDER_STATUS_CLASSES, ORDER_STATUS_LABELS, type AdminOrderSummary } from '@/typescript/schemas/order.schema';

/** One admin order row; links to the full order detail page. */
export default function OrderRow({ order }: { order: AdminOrderSummary }) {
  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className='flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5 transition-colors hover:border-primary-3'>
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='truncate text-sm font-medium text-secondary-black-3' dir='ltr'>
            {order.orderNumber}
          </span>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', ORDER_STATUS_CLASSES[order.status])}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-secondary-3'>
          <span>{order.customerName || '—'}</span>
          <span dir='ltr'>{order.phone || '—'}</span>
          <span>{order.username ? `کاربر: ${order.username}` : 'مهمان / بدون حساب'}</span>
        </div>
      </div>

      <div className='hidden shrink-0 flex-col items-end text-caption text-secondary-3 sm:flex'>
        <span>{order.createdAt || '—'}</span>
        <span className='flex items-center gap-1 font-medium text-secondary-1'>
          {order.total.toLocaleString('fa-IR')}
          <CurrencyLabel className='size-3.5' />
        </span>
      </div>

      <ChevronLeft className='shrink-0 text-secondary-3' size={18} aria-hidden='true' />
    </Link>
  );
}
