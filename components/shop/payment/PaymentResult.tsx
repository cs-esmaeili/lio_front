'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/shadcn/button';
import { useCart } from '@/hooks/cart/useCart';
import { getPaymentFailureMessage } from '@/utils/payment';
import type { PaymentResult as PaymentResultData } from '@/typescript/schemas/payment.schema';

function SuccessIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className='size-10' aria-hidden>
      <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
    </svg>
  );
}

function FailureIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className='size-10' aria-hidden>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l6.354 10.998ZM12 15.75h.007v.008H12v-.008Z'
      />
    </svg>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='flex items-center justify-between gap-4 py-4'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className={`text-sm font-semibold text-foreground ${mono ? 'tracking-wider' : ''}`} dir='ltr'>
        {value}
      </span>
    </div>
  );
}

/**
 * Presentational result of the bank callback. The only side effect is clearing
 * the stale basket after a successful payment, since the backend empties it.
 */
export default function PaymentResult({ result }: { result: PaymentResultData }) {
  const { refetch } = useCart();
  const isSuccess = result.status === 'success';

  useEffect(() => {
    if (isSuccess) void refetch();
  }, [isSuccess, refetch]);

  return (
    <div className='container mx-auto max-w-xl px-4 py-10' dir='rtl'>
      <div className='overflow-hidden rounded-3xl border border-border bg-white shadow-sm'>
        <div
          className={`flex flex-col items-center gap-3 px-6 py-10 text-center ${
            isSuccess ? 'bg-primary-0/10' : 'bg-destructive/10'
          }`}>
          <span
            className={`flex size-20 items-center justify-center rounded-full ${
              isSuccess ? 'bg-primary-0/15 text-primary-0' : 'bg-destructive/15 text-destructive'
            }`}>
            {isSuccess ? <SuccessIcon /> : <FailureIcon />}
          </span>
          <h1 className='text-lg font-bold text-foreground'>
            {isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت انجام نشد'}
          </h1>
          <p className='max-w-sm text-sm leading-6 text-muted-foreground'>
            {isSuccess
              ? 'سفارش شما ثبت شد و به‌زودی برای آماده‌سازی و ارسال بررسی می‌شود.'
              : getPaymentFailureMessage(result.reason)}
          </p>
        </div>

        {(result.orderNumber || (isSuccess && result.refId)) && (
          <div className='divide-y divide-border px-6'>
            {result.orderNumber && <DetailRow label='شماره سفارش' value={result.orderNumber} mono />}
            {isSuccess && result.refId && <DetailRow label='شماره پیگیری بانک' value={result.refId} mono />}
          </div>
        )}

        <div className='flex flex-col gap-3 p-6'>
          {isSuccess ? (
            <>
              <Button asChild size='lg' className='h-12 text-base'>
                <Link href='/dashboard/order'>پیگیری سفارش</Link>
              </Button>
              <Button asChild variant='outline' size='lg' className='h-12 text-base'>
                <Link href='/'>ادامه خرید</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size='lg' className='h-12 text-base'>
                <Link href='/checkout'>تلاش دوباره</Link>
              </Button>
              <Button asChild variant='outline' size='lg' className='h-12 text-base'>
                <Link href='/basket'>بازگشت به سبد خرید</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {isSuccess && (
        <p className='mt-5 text-center text-xs leading-6 text-muted-foreground'>
          اگر مبلغی از حساب شما کسر شده و سفارش ثبت نشده باشد، تا ۷۲ ساعت آینده بازگردانده می‌شود.
        </p>
      )}
    </div>
  );
}
