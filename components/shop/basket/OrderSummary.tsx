'use client';

import { SolidPrimaryButton } from '@/components/global/Buttons/SolidPrimaryButton';
import PriceWithToman from '@/components/global/PriceWithToman';
import { useAuth } from '@/hooks/auth/useAuth';
import { Switch } from '@/components/shadcn/switch';
import { Label } from '@/components/shadcn/label';
import { Field, FieldLabel } from '@/components/shadcn/field';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { Progress } from '@/components/shadcn/progress';
import { separator } from '@/utils/number';
import type { WalletInfo } from '@/typescript/types/checkout.types';

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
  wallet?: WalletInfo | null;
  maxPersent?: number;
  remaining?: number;
  maxPrice?: number;
}

export default function OrderSummary({
  finalPrice,
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
  wallet = null,
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

      {/* Wallet — readonly */}
      {wallet && wallet.balance > 0 && (
        <div className='flex flex-col gap-4'>
          <span className='block border-b border-primary-3 pb-2 text-body'>کیف پول</span>
          <div className='flex-1'>
            <div className='w-full h-full'>
              <FieldLabel>
                <Field orientation='horizontal' className='flex flex-col h-full'>
                  <div className='flex w-full items-center gap-3 text-body'>
                    <Switch disabled checked={true} />
                    <Label>استفاده خودکار از کیف پول</Label>
                  </div>
                  <span className='flex flex-row w-full text-secondary-2'>
                    موجودی شما:
                    <div className='flex items-start gap-1 whitespace-nowrap'>
                      <span className='text-secondary-black-1'>{wallet.balance.toLocaleString()}</span>
                      <div className='text-secondary-2 text-[10px] sm:text-[11px] md:text-[12px]'>
                        <CurrencyLabel />
                      </div>
                    </div>
                  </span>
                </Field>
              </FieldLabel>
            </div>
          </div>
        </div>
      )}

      

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
