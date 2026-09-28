'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import OrderList from '@/components/dashboard/order/OrderList';
import { ORDER_STATUS_TABS } from '@/components/dashboard/order/order.status';
import { Button } from '@/components/shadcn/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { useMyOrders } from '@/hooks/order/useMyOrders';
import type { OrderStatus } from '@/typescript/schemas/order.schema';

const PAGE_SIZE = 10;

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<string>(ORDER_STATUS_TABS[0]?.key ?? 'ALL');
  const [page, setPage] = useState(1);

  const status = activeTab === 'ALL' ? undefined : (activeTab as OrderStatus);

  const { data, loading, error, refetch } = useMyOrders({ page, limit: PAGE_SIZE, status });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const canPrev = page > 1;
  const canNext = page < (data.totalPages ?? 1);

  return (
    <div className='flex h-full flex-col gap-6 rounded-2xl border-2 border-gray-1 p-4'>
      <Tabs value={activeTab} onValueChange={handleTabChange} dir='rtl' className='flex flex-1 flex-col gap-6'>
        <PageHeader
          titleSlot={
            <TabsList variant='line' className='flex !h-auto w-full justify-start gap-5'>
              {ORDER_STATUS_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className='group flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1'>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          }
        />

        <TabsContent value={activeTab} className='flex-1'>
          <div className='flex h-full w-full flex-col gap-4'>
            {loading && data.items.length === 0 ? (
              <div className='flex h-full w-full min-h-64 flex-1 items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-1 border-t-primary-1' />
              </div>
            ) : error && data.items.length === 0 ? (
              <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-primary-1 text-center'>
                <h5 className='text-gray-3'>{error}</h5>
                <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
                  تلاش دوباره
                </Button>
              </div>
            ) : data.items.length === 0 ? (
              <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center'>
                <div className='relative mb-4 h-20 w-20'>
                  <Image src='/icons/empty-data.svg' alt='No Orders' fill className='object-contain' />
                </div>

                <h5 className='text-gray-3'>هنوز سفارشی وجود ندارد</h5>
              </div>
            ) : (
              <OrderList orders={data.items} />
            )}
          </div>
        </TabsContent>

        {data.total > 0 && (
          <div className='flex items-center justify-between'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-9 rounded-lg border-gray-1'
              disabled={!canPrev || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}>
              <ChevronRight />
              قبلی
            </Button>

            <span className='text-caption text-secondary-2'>
              صفحه {data.page.toLocaleString('fa-IR')} از {data.totalPages.toLocaleString('fa-IR')} — {data.total.toLocaleString('fa-IR')}{' '}
              سفارش
            </span>

            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-9 rounded-lg border-gray-1'
              disabled={!canNext || loading}
              onClick={() => setPage((current) => current + 1)}>
              بعدی
              <ChevronLeft />
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
}
