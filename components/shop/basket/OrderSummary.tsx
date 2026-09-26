'use client';

import { SolidPrimaryButton } from '@/components/global/Buttons/SolidPrimaryButton';
import PriceWithToman from '@/components/global/PriceWithToman';
import { useAuth } from '@/hooks/auth/useAuth';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { Progress } from '@/components/shadcn/progress';
import { separator } from '@/utils/number';

interface OrderSummaryProps {
  finalPrice: number;
  discount: number;
  paymentPrice: number;
  itemCount: number;
  basePrice?: number;
  desktopButtonText?: string;
  mobileButtonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
  maxPersent?: number;
  remaining?: number;
  maxPrice?: number;
}

export default function OrderSummary({
  discount,
  paymentPrice,
  itemCount,
  basePrice,
  desktopButtonText = '',
  mobileButtonText = '',
  buttonHref,
  onButtonClick,
  buttonDisabled = false,
  children,
  maxPersent = 0,
  remaining = 0,
  maxPrice = 0,
}: OrderSummaryProps) {
  const { isLoggedIn, isHydrated } = useAuth();

  const href = buttonHref ?? (isLoggedIn ? '/checkout' : `/login?returnUrl=${encodeURIComponent('/checkout')}`);

  return (
    <>
    
    {/* Free shipping progress */}
      {maxPrice > 0 && (
        <div className='flex flex-col gap-4 bg-green-100 rounded-2xl p-4'>
          <div className='space-y-2'>
            {maxPersent === 100 ? (
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
              <Progress value={maxPersent} className='flex-1 h-2' />
              <span className='text-sm text-gray-500 min-w-[3ch] text-left'>{maxPersent}%</span>
            </div>
          </div>
        </div>
      )}
   

    <div className='flex flex-col gap-4 bg-gray-1 rounded-2xl p-4'>
      {children && <div className='flex flex-col gap-4'>{children}</div>}

      <div className='flex flex-col gap-5 text-sm'>
        <div className='flex justify-between'>
          <span className='text-secondary-black-1'>قیمت کالا ها ({itemCount})</span>
          <PriceWithToman price={basePrice ?? paymentPrice} />
        </div>

        <div className='flex justify-between'>
          <span className='text-secondary-black-1'>سود شما از خرید</span>
          <PriceWithToman price={discount} />
        </div>

        <div className='flex justify-between'>
          <span className='text-secondary-black-1'>هزینه قابل پرداخت</span>
          <PriceWithToman price={paymentPrice} />
        </div>
      </div>

      {isHydrated && (
        <SolidPrimaryButton
          href={href}
          desktopText={desktopButtonText}
          mobileText={mobileButtonText}
          className={`w-full ${buttonDisabled ? 'pointer-events-none opacity-50' : ''}`}
          onClick={buttonDisabled ? undefined : onButtonClick}
        />
      )}

      <div className='text-sm text-center text-secondary-2'>
        <p>هزینه این سفارش هنوز پرداخت نشده و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند</p>
      </div>
    </div>

    </>
  );
}
