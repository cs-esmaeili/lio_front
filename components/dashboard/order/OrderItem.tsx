'use client';

import Image from 'next/image';

import type { OrderItem } from '@/components/dashboard/order/order.model';
import Link from 'next/link';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';


interface OrderItemProps {
  item: OrderItem;
}


export default function OrderItem({ item }: OrderItemProps) {
  //------------------------------------------------------

  const formatPrice = (price: number) => `${price.toLocaleString('fa-IR')}`;

  //------------------------------------------------------

  const totalPrice = item.unitPrice * item.quantity;

  //------------------------------------------------------

  return (
    <div className='flex flex-wrap items-center gap-1 md:gap-4 border-b border-gray-200 p-3.5'>
      <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white'>
        {item.image ? (
          <Image src={item.image} alt={item.title} fill className='object-contain p-2' sizes='80px' />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-xs text-gray-400'>بدون تصویر</div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-2'>
        <h6 className='font-medium text-secondary-1'>
          <Link href={`/product/${item.slug}`}>{item.title}</Link>
        </h6>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-400'>
          <div>
            تعداد:
            <span className='mr-1 font-medium'>{item.quantity}</span>
          </div>

          <div className='flex items-center gap-1 whitespace-nowrap'>
            قیمت واحد:
            <span className='mr-1 font-medium'>{formatPrice(item.unitPrice)}</span>
            <div className='text-secondary-1 flex flex-col items-end text-[0.7rem] leading-2 relative -top-[0.05rem]'>
              <CurrencyLabel />
            </div>
          </div>
        </div>
      </div>

      <div className='text-left flex items-center gap-1 whitespace-nowrap max-sm:flex max-sm:w-full max-sm:justify-center max-sm:bg-primary-4/70 max-sm:px-1.5 max-sm:py-1 max-sm:rounded'>
        <span className='font-semibold text-secondary-1'>{formatPrice(totalPrice)}</span>
        <div className='text-secondary-1 flex flex-col items-end text-[0.7rem] leading-2 relative -top-[0.05rem]'>
          <CurrencyLabel />
        </div>
      </div>
    </div>
  );
}
