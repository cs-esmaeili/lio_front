'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Icon from '@/components/global/Icon';
import { TruckTime } from 'iconsax-reactjs';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import OrderList from '@/components/dashboard/order/OrderList';
import OrderTrackingForm from '@/components/dashboard/order/OrderTrackingForm';
import type { Order } from '@/components/dashboard/order/order.model';
import { orderByQ } from '@/services/order.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';
import { mapOrder } from '@/components/dashboard/order/order.mapper';

type SearchState = 'initial' | 'loading' | 'empty' | 'result';

function TrackingPage() {
  const searchParams = useSearchParams();

  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [searchedOrders, setSearchedOrders] = useState<Order[]>([]);

  const pageInfo = {
    href: '/dashboard/tracking',
    label: 'پیگیری سفارش',
    icon: TruckTime,
  };

  const handleSearch = useCallback(async (code: string) => {
    try {
      setSearchState('loading');
      setSearchedOrders([]);

      const response = await orderByQ(code);
      const responseData = response.data?.data;

      let apiOrders: any[] = [];

      if (Array.isArray(responseData?.orders)) {
        apiOrders = responseData.orders;
      } else if (responseData?.order) {
        apiOrders = [responseData.order];
      } else if (responseData?.id) {
        apiOrders = [responseData];
      }

      if (apiOrders.length === 0) {
        setSearchedOrders([]);
        setSearchState('empty');
        return;
      }

      const orders = apiOrders.map((apiOrder) => mapOrder(apiOrder));

      setSearchedOrders(orders);
      setSearchState('result');
    } catch (error: unknown) {
      setSearchedOrders([]);

      if (!(isApiError(error) && error.handled)) {
        toast.error(getApiErrorMessage(error, 'سفارشی با این شماره پیدا نشد.'));
      }

      setSearchState('empty');
    }
  }, []);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      handleSearch(codeFromUrl);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className='flex h-full flex-col items-start gap-6 rounded-2xl border-2 border-gray-1 p-6'>
      <div className='flex w-full flex-col gap-6'>
        {/* Page Header */}

        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={pageInfo.icon}
                className='text-secondary-black-3 transition-colors duration-200'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />

              <span className='text-regular text-secondary-1'>{pageInfo.label}</span>
            </div>
          }
        />

        {/* Search */}

        <OrderTrackingForm loading={searchState === 'loading'} initialValue={searchParams.get('code') ?? ''} onSearch={handleSearch} />

        {/* Initial */}

        {searchState === 'initial' && (
          <div className='flex min-h-72 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center px-2'>
            <div className='relative mb-4 h-20 w-20'>
              <Image src='/icons/empty-data.svg' alt='Search Order' fill className='object-contain' />
            </div>

            <h5 className='text-gray-3'>شماره سفارش را وارد کنید</h5>

          </div>
        )}

        {/* Loading */}

        {searchState === 'loading' && (
          <div className='flex min-h-72 items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary-1 border-t-transparent' />
          </div>
        )}

        {/* Empty */}

        {searchState === 'empty' && (
          <div className='flex min-h-72 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center px-2'>
            <div className='relative mb-4 h-20 w-20'>
              <Image src='/icons/empty-data.svg' alt='No Order' fill className='object-contain' />
            </div>

            <h5 className='text-gray-3'>سفارشی پیدا نشد</h5>

          </div>
        )}

        {/* Result */}

        {searchState === 'result' && searchedOrders.length > 0 && (
          <div className='w-full'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <span className='text-sm font-semibold text-secondary-1'>وضعیت سفارش</span>
            </div>

            <OrderList orders={searchedOrders} onView={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPageWithSuspense() {
  return (
    <Suspense fallback={null}>
      <TrackingPage />
    </Suspense>
  );
}
