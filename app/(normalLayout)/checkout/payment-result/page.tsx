import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { orderInvoiceSSR } from '@/services/checkout.service';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

enum Status {
  successful = 'successful',
  fail = 'fail',
  Pending = 'pending',
}

function getStatusBadge(status: Status) {
  if (status == Status.successful) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-primary-0/15 px-3 py-1 text-xs font-medium text-primary-0'>
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
        پرداخت موفق
      </span>
    );
  }
  if (status == Status.fail) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive'>
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
        پرداخت ناموفق
      </span>
    );
  }
  if (status == Status.Pending) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
        در انتظار تایید کارشناس
      </span>
    );
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const code = typeof params.order_code === 'string' ? params.order_code : undefined;

  if (!code) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-10'>
        <div className='rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center'>
          <p className='text-sm text-destructive'>کد سفارش یافت نشد.</p>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  let invoiceData;
  let fetchError = false;

  try {
    invoiceData = await orderInvoiceSSR(code, token);
  } catch {
    fetchError = true;
  }

  if (fetchError || !invoiceData?.data) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-10'>
        <div className='rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center'>
          <p className='text-sm text-destructive'>خطا در دریافت اطلاعات فاکتور. لطفاً دوباره تلاش کنید.</p>
        </div>
      </div>
    );
  }

  const { order, gateways } = invoiceData.data;
  const isSuccess = Boolean(order.is_payment);

  return (
    <div className='container mx-auto max-w-2xl px-4 py-6' dir='rtl'>
      <h1 className='mb-6 text-center text-lg font-bold text-foreground'>نتیجه پرداخت</h1>

      {/* Status Banner */}
      <div
        className={`mb-6 rounded-2xl p-6 text-center ${
          isSuccess ? 'border border-primary-0/20 bg-primary-0/10' : 'border border-destructive/20 bg-destructive/10'
        }`}>
        {isSuccess ? (
          <svg className='mx-auto mb-3 h-14 w-14 text-primary-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        ) : (
          <svg className='mx-auto mb-3 h-14 w-14 text-destructive' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            />
          </svg>
        )}
        <p className='text-base font-semibold text-foreground'>{isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت با خطا مواجه شد'}</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          {isSuccess ? 'سفارش شما ثبت و در حال پیگیری است' : 'در صورت کسر وجه، تا ۷۲ ساعت آینده به حساب شما بازگردانده خواهد شد'}
        </p>
      </div>

      {/* Order Info Card */}
      <div className='mb-4 rounded-2xl border border-border bg-card p-5'>
        <h2 className='mb-4 text-sm font-semibold text-foreground'>اطلاعات سفارش</h2>
        <div className='space-y-3'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <span className='text-sm text-muted-foreground'>شماره سفارش</span>
            <span className='text-sm font-medium text-foreground'>{order.code}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>مبلغ نهایی</span>
            <span className='flex items-center gap-1 text-base font-bold text-foreground'>
              {formatAmount(order.final_amount)}
              <CurrencyLabel className='h-4 w-4 text-secondary-2' />
            </span>
          </div>
        </div>
      </div>

      {/* Gateways Card */}
      <div className='rounded-2xl border border-border bg-card p-5'>
        <h2 className='mb-4 text-sm font-semibold text-foreground'>جزئیات پرداخت</h2>
        <div className='space-y-3'>
          {gateways.map((gateway, index) => (
            <div key={index} className='flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-foreground'>{gateway.title}</span>
                {getStatusBadge(gateway.is_card == false ? (gateway.successful ? Status.successful : Status.fail) : Status.Pending)}
              </div>
              <span className='flex items-center gap-1 text-sm font-medium text-foreground'>
                {formatAmount(gateway.amount)}
                <CurrencyLabel className='h-3.5 w-3.5 text-muted-foreground' />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href='/dashboard/order'
        className='mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-1 px-6 py-3.5 text-sm font-medium text-primary-4 transition-colors hover:bg-primary-black-1'>
        پیگیری سفارش
        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </Link>
    </div>
  );
}
