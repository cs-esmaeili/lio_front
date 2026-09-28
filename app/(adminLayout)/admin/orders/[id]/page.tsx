'use client';

import { useParams } from 'next/navigation';

import OrderStatusActions from '@/components/admin/order-manager/OrderStatusActions';
import OrderDetail from '@/components/dashboard/order/OrderDetail';
import PermissionGate from '@/components/global/PermissionGate';
import { useAdminOrder } from '@/hooks/order/useAdminOrder';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = raw ? Number(raw) : undefined;

  const { order, loading, refetch } = useAdminOrder(Number.isFinite(id) ? id : undefined);

  return (
    <PermissionGate allOf={[PERMISSIONS.ORDER_READ]}>
      {loading ? (
        <div className='flex h-full min-h-64 items-center justify-center rounded-2xl border-2 border-gray-1'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-1 border-t-primary-1' />
        </div>
      ) : !order ? (
        <div className='flex h-full min-h-64 items-center justify-center rounded-2xl border-2 border-gray-1'>
          <span className='text-secondary-2'>سفارش موردنظر یافت نشد.</span>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <OrderStatusActions order={order} onChanged={() => void refetch()} />
          <OrderDetail order={order} backHref='/admin/orders' isAdmin />
        </div>
      )}
    </PermissionGate>
  );
}
