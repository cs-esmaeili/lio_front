'use client';

import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { Label } from '@/components/shadcn/label';
import { Field, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import CardToCardSection from './CardToCardSection';
import type { PaymentMethod, CheckoutCartInfo, CardMethodData } from '@/typescript/types/checkout.types';

/** Synthetic payment method ID for card-to-card option in radio group */
export const CARD_TO_CARD_PAYMENT_ID = -1;

interface PaymentSectionProps {
  showCouponBox: boolean;
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  couponLoading: boolean;
  onApplyCoupon: () => void;
  canApplyCoupon: boolean;
  couponCart: CheckoutCartInfo | null;
  onRemoveCoupon: () => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: number | null;
  onPaymentMethodChange: (id: number) => void;
  cardMethods: boolean;
  paymentMethodsData: CardMethodData[];
  onTransactionFileSelect: (file: File | undefined) => void;
}

export default function PaymentSection({
  showCouponBox,
  couponCode,
  onCouponCodeChange,
  couponLoading,
  onApplyCoupon,
  canApplyCoupon,
  couponCart,
  onRemoveCoupon,
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodChange,
  cardMethods,
  paymentMethodsData,
  onTransactionFileSelect,
}: PaymentSectionProps) {
  const isCardToCardSelected = selectedPaymentMethodId === CARD_TO_CARD_PAYMENT_ID;

  return (
    <div className='flex flex-col gap-4 bg-white rounded-2xl p-4 w-full'>
      {/* Coupon */}
      {showCouponBox && !couponCart && (
        <>
          <span className='block border-b border-primary-3 pb-2 text-body'>کد تخفیف</span>
          <div className='flex flex-row gap-3 items-end'>
            <div className='flex-1'>
              <Input
                id='coupon-code'
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                placeholder='کد تخفیف خود را وارد کنید'
                className='h-10'
              />
            </div>
            <button
              type='button'
              disabled={!canApplyCoupon || couponLoading}
              className='h-10 px-4 rounded-lg bg-primary-1 text-white text-sm disabled:opacity-50'
              onClick={onApplyCoupon}>
              {couponLoading ? 'در حال بررسی...' : 'اعمال'}
            </button>
          </div>
        </>
      )}

      {/* Applied coupon card */}
      {showCouponBox && couponCart && (
        <>
          <span className='block border-b border-primary-3 pb-2 text-body'>کد تخفیف</span>
          <div className='flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-3'>
            <div className='flex flex-col gap-0.5 text-sm'>
              <span className='text-secondary-black-1 font-medium'>{couponCode}</span>
              {couponCart.have_coupon_post && (
                <span className='text-green-600 text-xs'>
                  {couponCart.have_coupon_post.is_percent
                    ? `${couponCart.have_coupon_post.discount_value}% تخفیف`
                    : `${couponCart.have_coupon_post.discount_value.toLocaleString()} ${process.env.NEXT_PUBLIC_CURRENCY} تخفیف`}
                </span>
              )}
            </div>
            <button
              type='button'
              disabled={couponLoading}
              onClick={onRemoveCoupon}
              className='text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50'
              aria-label='حذف کد تخفیف'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M15 5L5 15M5 5L15 15' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Payment methods */}
      <span className='block border-b border-primary-3 pb-2 text-body'>انتخاب روش پرداخت</span>

      <div className='flex flex-col gap-3'>
        <div className='flex-1'>
          <RadioGroup
            value={String(selectedPaymentMethodId ?? '')}
            onValueChange={(v) => onPaymentMethodChange(Number(v))}
            className='flex flex-col gap-3'
            dir='rtl'>
            {paymentMethods.map((pm) => (
              <FieldLabel key={pm.id}>
                <Field orientation='horizontal' className='flex flex-col h-full'>
                  <div className='flex w-full items-center gap-3 text-body'>
                    <RadioGroupItem value={String(pm.id)} id={`payment-${pm.id}`} />
                    <Label htmlFor={`payment-${pm.id}`}>{pm.title}</Label>
                  </div>
                  <span className='w-full text-secondary-2'>پرداخت آنلاین با تمامی کارت های بانکی</span>
                </Field>
              </FieldLabel>
            ))}

            {/* Card-to-card radio option */}
            {cardMethods && (
              <FieldLabel>
                <Field orientation='horizontal' className='flex flex-col h-full'>
                  <div className='flex w-full items-center gap-3 text-body'>
                    <RadioGroupItem value={String(CARD_TO_CARD_PAYMENT_ID)} id={`payment-${CARD_TO_CARD_PAYMENT_ID}`} />
                    <Label htmlFor={`payment-${CARD_TO_CARD_PAYMENT_ID}`}>کارت به کارت</Label>
                  </div>
                  <span className='w-full text-secondary-2'>پرداخت از طریق کارت به کارت</span>
                </Field>
              </FieldLabel>
            )}
          </RadioGroup>
        </div>
      </div>

      {/* Card to card section — only visible when selected */}
      {cardMethods && isCardToCardSelected && <CardToCardSection paymentMethodsData={paymentMethodsData} onFileSelect={onTransactionFileSelect} />}
    </div>
  );
}
