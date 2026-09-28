'use client';

import { useParams } from 'next/navigation';

import OrderDetail from '@/components/dashboard/order/OrderDetail';
import { useMyOrder } from '@/hooks/order/useMyOrder';

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = typeof params.id === 'string' ? params.id : params.id?.[0];

  const { loading, order } = useMyOrder(orderNumber);

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center rounded-2xl border-2 border-gray-1'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-1 border-t-primary-1' />
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex h-full items-center justify-center rounded-2xl border-2 border-gray-1'>
        <span className='text-secondary-2'>سفارش موردنظر یافت نشد.</span>
      </div>
    );
  }

  return <OrderDetail order={order} />;
}
