'use client';

import Image from 'next/image';
import { ShoppingCart } from 'iconsax-reactjs';

import Icon from '@/components/global/Icon';
import PageHeader from '@/components/dashboard/PageHeader';
import OrderStatCard from '@/components/dashboard/order/OrderStatCard';
import { Spinner } from '@/components/shadcn/spinner';
import { useMyOrderSummary } from '@/hooks/order/useMyOrderSummary';
import emptyData from '@/public/icons/empty-data.svg';

export default function DashboardHome() {
  const { summary, loading } = useMyOrderSummary();

  const cards = summary.items.filter((item) => item.count > 0);

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full flex-col gap-3 rounded-xl border-2 border-gray-1 p-6 sm:p-4'>
        <PageHeader
          className='mb-2 sm:mb-4'
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={ShoppingCart}
                className='text-secondary-black-3 transition-colors duration-200'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />

              <span className='text-regular text-secondary-1'>اطلاعات سفارش ها</span>
            </div>
          }
        />

        {loading ? (
          <div className='flex w-full items-center justify-center py-16'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : summary.total === 0 ? (
          <div className='flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-1 py-12 text-center'>
            <div className='relative mb-4 h-20 w-20'>
              <Image src={emptyData} alt='No orders' fill className='object-contain' sizes='80px' />
            </div>

            <h6 className='text-gray-3'>سفارشی وجود ندارد</h6>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-hidden rounded-xl'>
            {cards.map((item) => (
              <div key={item.status} className='flex flex-1'>
                <OrderStatCard title={item.title} count={item.count} statusId={item.toneId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
