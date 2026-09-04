'use client';

import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { Label } from '@/components/shadcn/label';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import type { ShippingMethod } from '@/typescript/types/checkout.types';

interface ShippingMethodSectionProps {
  shippingMethods: ShippingMethod[];
  selectedShippingMethodId: number | null;
  onSelect: (id: number) => void;
  loading?: boolean;
}

export default function ShippingMethodSection({
  shippingMethods,
  selectedShippingMethodId,
  onSelect,
  loading = false,
}: ShippingMethodSectionProps) {
  if (loading) {
    return (
      <div className='flex items-center justify-center py-6'>
        <div className='size-6 animate-spin rounded-full border-2 border-primary-1 border-t-transparent' />
      </div>
    );
  }

  if (shippingMethods.length === 0) {
    return null;
  }

  return (
    <>
      <span className='my-6 block border-b border-primary-3 pb-2 text-body'>
        انتخاب روش ارسال
      </span>

      <RadioGroup
        value={String(selectedShippingMethodId ?? '')}
        onValueChange={(v) => onSelect(Number(v))}
        className='flex flex-col gap-3'
        dir='rtl'
      >
        {shippingMethods.map((method) => {
          const isSelected = selectedShippingMethodId === method.id;

          return (
            <div
              key={method.id}
              className={`flex flex-col gap-3 rounded-xl border p-5 transition-colors md:flex-row md:items-center ${
                isSelected
                  ? 'border-primary-1'
                  : 'border-gray-200'
              }`}
            >
              <div className='flex items-center gap-3'>
                <RadioGroupItem
                  value={String(method.id)}
                  id={`shipping-${method.id}`}
                />

                <Label htmlFor={`shipping-${method.id}`}>
                  {method.title}
                </Label>
              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-3'>
                <div className='flex flex-row gap-1 border-0 border-gray-200 px-0 md:border-r-1 md:px-3'>
                  <span className='text-secondary-2'>
                    هزینه ارسال:
                  </span>

                  <div className='flex items-start gap-1 whitespace-nowrap'>
                    <span className='text-secondary-black-1'>
                      {method.amount.toLocaleString()}
                    </span>

                    <div className='text-[10px] text-secondary-2 sm:text-[11px] md:text-[12px]'>
                      <CurrencyLabel />
                    </div>
                  </div>
                </div>

                {/* 
                {(method.min_post_time || method.max_post_time) && (
                  <div className='flex flex-row gap-1 border-0 border-gray-200 px-0 md:border-r-1 md:px-3'>
                    <span className='text-secondary-2'>
                      زمان ارسال:
                    </span>

                    <span className='text-sm text-secondary-black-1'>
                      {method.min_post_time && method.max_post_time
                        ? `${method.min_post_time} تا ${method.max_post_time}`
                        : method.max_post_time || method.min_post_time}
                    </span>
                  </div>
                )}
                */}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </>
  );
}