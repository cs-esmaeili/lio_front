'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CircleAlert, RefreshCw, Search, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from '@/typescript/schemas/order.schema';
import OrderRow from './OrderRow';

const PAGE_SIZE = 20;
const ALL = 'ALL';

/** Admin orders list across every customer, with search, status filter and pagination. */
export default function OrdersManager() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | typeof ALL>(ALL);

  const { data, loading, error, refetch } = useAdminOrders({
    page,
    limit: PAGE_SIZE,
    search,
    status: status === ALL ? undefined : status,
  });

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const canPrev = page > 1;
  const canNext = page < (data.totalPages ?? 1);

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>سفارشات</h1>
          <p className='text-regular text-secondary-2'>همه سفارشات مشتریان را جستجو، فیلتر و مرور کنید.</p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-11 w-11 shrink-0 rounded-xl border-gray-2 text-secondary-2'
          title='بروزرسانی'
          disabled={loading}
          onClick={() => void refetch()}>
          {loading ? <Spinner /> : <RefreshCw />}
        </Button>
      </div>

      {/* Toolbar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative min-w-0 flex-1 sm:max-w-80'>
          <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder='جستجوی شماره سفارش، نام یا شماره تماس...'
            className='h-10 ps-8'
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as OrderStatus | typeof ALL);
            setPage(1);
          }}>
          <SelectTrigger className='!h-10 w-full sm:w-44' dir='rtl'>
            <SelectValue placeholder='وضعیت' />
          </SelectTrigger>
          <SelectContent position='popper' dir='rtl' className='z-50'>
            <SelectItem value={ALL}>همه وضعیت‌ها</SelectItem>
            {ORDER_STATUSES.map((key) => (
              <SelectItem key={key} value={key}>
                {ORDER_STATUS_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading && data.items.length === 0 ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-16 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && data.items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : data.items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <ShoppingCart className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>سفارشی با این مشخصات پیدا نشد.</p>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-2'>
            {data.items.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-9 rounded-lg border-gray-2'
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
              className='h-9 rounded-lg border-gray-2'
              disabled={!canNext || loading}
              onClick={() => setPage((current) => current + 1)}>
              بعدی
              <ChevronLeft />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
