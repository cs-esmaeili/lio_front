'use client';

import { useState } from 'react';
import { PackageCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { useAuth } from '@/hooks/auth/useAuth';
import { completeOrderCSR, shipOrderCSR } from '@/services/adminOrders.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import type { Order } from '@/typescript/schemas/order.schema';

/**
 * Fulfilment actions for a single admin order: record the postal tracking code
 * and move a paid order to `SHIPPED`, then complete a shipped order. Rendered
 * only for users that hold the `order:manage` permission.
 */
export default function OrderStatusActions({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const { hasPermission } = useAuth();
  const [shipOpen, setShipOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!hasPermission(PERMISSIONS.ORDER_MANAGE)) return null;
  if (order.status !== 'PAID' && order.status !== 'SHIPPED') return null;

  const orderId = Number(order.id);

  const handleShip = async () => {
    const code = trackingCode.trim();
    if (!code) {
      toast.error('کد رهگیری را وارد کنید.');
      return;
    }

    setSubmitting(true);
    try {
      await shipOrderCSR(orderId, code);
      toast.success('سفارش به «ارسال شده» تغییر کرد.');
      setShipOpen(false);
      setTrackingCode('');
      onChanged();
    } catch (error) {
      if (!(isApiError(error) && error.handled)) {
        toast.error(getApiErrorMessage(error, 'ثبت ارسال سفارش ناموفق بود.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await completeOrderCSR(orderId);
      toast.success('سفارش به «اتمام» تغییر کرد.');
      setCompleteOpen(false);
      onChanged();
    } catch (error) {
      if (!(isApiError(error) && error.handled)) {
        toast.error(getApiErrorMessage(error, 'اتمام سفارش ناموفق بود.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className='flex flex-wrap items-center justify-end gap-3'>
        {order.status === 'PAID' && (
          <Button type='button' className='h-11 rounded-xl px-5' onClick={() => setShipOpen(true)}>
            <Truck />
            ثبت ارسال و کد رهگیری
          </Button>
        )}

        {order.status === 'SHIPPED' && (
          <Button type='button' className='h-11 rounded-xl px-5' onClick={() => setCompleteOpen(true)}>
            <PackageCheck />
            اتمام سفارش
          </Button>
        )}
      </div>

      <ReusableModal open={shipOpen} onOpenChange={setShipOpen} title='ثبت ارسال سفارش' size='sm'>
        <div className='flex flex-col gap-4' dir='rtl'>
          <p className='text-regular text-secondary-2'>کد رهگیری پست را وارد کنید. سفارش به وضعیت «ارسال شده» می‌رود.</p>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1' htmlFor='tracking-code'>
              کد رهگیری
            </label>
            <Input
              id='tracking-code'
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder='مثلاً ۱۲۳۴۵۶۷۸۹۰'
              dir='ltr'
              className='h-11'
            />
          </div>

          <div className='flex items-center gap-3'>
            <Button type='button' variant='outline' className='h-11 flex-1 rounded-xl border-gray-2' disabled={submitting} onClick={() => setShipOpen(false)}>
              انصراف
            </Button>
            <Button type='button' className='h-11 flex-1 rounded-xl' disabled={submitting} onClick={() => void handleShip()}>
              {submitting ? 'در حال ثبت...' : 'ثبت ارسال'}
            </Button>
          </div>
        </div>
      </ReusableModal>

      <ReusableModal open={completeOpen} onOpenChange={setCompleteOpen} title='اتمام سفارش' size='sm'>
        <div className='flex flex-col gap-4' dir='rtl'>
          <p className='text-regular text-secondary-2'>آیا از اتمام این سفارش مطمئن هستید؟</p>

          <div className='flex items-center gap-3'>
            <Button type='button' variant='outline' className='h-11 flex-1 rounded-xl border-gray-2' disabled={submitting} onClick={() => setCompleteOpen(false)}>
              انصراف
            </Button>
            <Button type='button' className='h-11 flex-1 rounded-xl' disabled={submitting} onClick={() => void handleComplete()}>
              {submitting ? 'در حال ثبت...' : 'اتمام سفارش'}
            </Button>
          </div>
        </div>
      </ReusableModal>
    </>
  );
}
