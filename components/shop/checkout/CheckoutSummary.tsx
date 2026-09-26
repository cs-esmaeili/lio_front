'use client';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import PriceWithToman from '@/components/global/PriceWithToman';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { Progress } from '@/components/shadcn/progress';
import { separator } from '@/utils/number';

import type { Checkout } from '@/typescript/schemas/checkout.schema';

/**
 * Order pricing summary. Everything is derived from the `GET /checkout`
 * payload; the buy button is disabled here and wired by the checkout page.
 */
export default function CheckoutSummary({
  checkout,
  buttonText = 'پرداخت',
  buttonDisabled = false,
  buttonLoading = false,
  onButtonClick,
}: {
  checkout: Checkout;
  buttonText?: string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  onButtonClick?: () => void;
}) {
  const { subtotal, totalDiscount, shippingCost, total, itemCount, shipping } = checkout;

  const freeOver = shipping.freeOver;
  const isFreeShipping = freeOver > 0 && subtotal >= freeOver;
  const remaining = freeOver > 0 ? Math.max(freeOver - subtotal, 0) : 0;
  const progress = freeOver > 0 ? Math.min(Math.round((subtotal / freeOver) * 100), 100) : 0;

  return (
    <>
      {/* Free shipping progress */}
      {freeOver > 0 && (
        <div className='flex flex-col gap-4 bg-green-100 rounded-2xl p-4'>
          <div className='space-y-2'>
            {isFreeShipping ? (
              <div className='text-sm text-green-600 font-medium'>هزینه ارسال رایگان است</div>
            ) : (
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>مانده تا ارسال رایگان</span>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-secondary-black-1 font-bold'>{separator(remaining)}</span>
                  <CurrencyLabel />
                </div>
              </div>
            )}

            <div className='flex items-center gap-2'>
              <Progress value={progress} className='flex-1 h-2' />
              <span className='text-sm text-gray-500 min-w-[3ch] text-left'>{progress}%</span>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-4 bg-gray-1 rounded-2xl p-4'>
        <div className='flex flex-col gap-5 text-sm'>
          <div className='flex justify-between'>
            <span className='text-secondary-black-1'>قیمت کالا ها ({itemCount})</span>
            <PriceWithToman price={subtotal} />
          </div>

          <div className='flex justify-between'>
            <span className='text-secondary-black-1'>سود شما از خرید</span>
            <PriceWithToman price={totalDiscount} />
          </div>

          <div className='flex justify-between'>
            <span className='text-secondary-black-1'>هزینه ارسال</span>
            <PriceWithToman price={shippingCost} />
          </div>

          <div className='flex justify-between'>
            <span className='text-secondary-black-1'>هزینه قابل پرداخت</span>
            <PriceWithToman price={total} />
          </div>
        </div>

        <Button
          type='button'
          size='lg'
          className='h-12 w-full rounded-lg text-base'
          disabled={buttonDisabled || buttonLoading}
          onClick={onButtonClick}>
          {buttonLoading && <Spinner className='size-4' />}
          {buttonLoading ? 'در حال انتقال به درگاه بانک…' : buttonText}
        </Button>

        <div className='text-sm text-center text-secondary-2'>
          <p>هزینه این سفارش هنوز پرداخت نشده و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند</p>
        </div>
      </div>
    </>
  );
}
