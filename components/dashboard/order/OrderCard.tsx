'use client';

import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { ArrowLeft2, InfoCircle, ChartCircle, House, TickCircle, Danger, CloseCircle, MoneyRecive, MoneyChange } from 'iconsax-reactjs';

import type { Order } from '@/components/dashboard/order/order.model';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';

interface OrderCardProps {
  order: Order;

  onView: (order: Order) => void;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusClassIcon = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'bg-[#F59E0B]/20 text-[#F59E0B]';

      case 0:
        return 'bg-[#3B82F6]/20 text-[#3B82F6]';

      case 1:
        return 'bg-[#06B6D4]/20 text-[#06B6D4]';

      case 2:
        return 'bg-[#22C55E]/20 text-[#22C55E]';

      case 3:
        return 'bg-[#F97316]/20 text-[#F97316]';

      case 4:
        return 'bg-[#EF4444]/20 text-[#EF4444]';

      case 5:
        return 'bg-[#64748B]/20 text-[#64748B]';

      case 6:
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6]';

      default:
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6]';
    }
  };

  const getStatusClassBorder = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'border-[#F59E0B]/20';

      case 0:
        return 'border-[#3B82F6]/20';

      case 1:
        return 'border-[#06B6D4]/20';

      case 2:
        return 'border-[#22C55E]/20';

      case 3:
        return 'border-[#F97316]/20';

      case 4:
        return 'border-[#EF4444]/20';

      case 5:
        return 'border-[#64748B]/20';

      case 6:
        return 'border-[#8B5CF6]/20';

      default:
        return 'border-[#8B5CF6]/20';
    }
  };

  const getStatusClassLabel = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'text-[#F59E0B]';

      case 0:
        return 'text-[#3B82F6]';

      case 1:
        return 'text-[#06B6D4]';

      case 2:
        return 'text-[#22C55E]';

      case 3:
        return 'text-[#F97316]';

      case 4:
        return 'text-[#EF4444]';

      case 5:
        return 'text-[#64748B]';

      case 6:
        return 'text-[#8B5CF6]';

      default:
        return 'text-[#8B5CF6]';
    }
  };

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case -1:
        return InfoCircle;

      case 0:
        return ChartCircle;

      case 1:
        return House;

      case 2:
        return TickCircle;

      case 3:
        return Danger;

      case 4:
        return CloseCircle;

      case 5:
        return MoneyRecive;

      case 6:
        return MoneyChange;

      default:
        return InfoCircle;
    }
  };

  const formatPrice = (price: number) => `${price.toLocaleString('fa-IR')}`;

  return (
    // <Link href={`/dashboard/order/${order.orderNumber}`}>
    <div className={`flex items-start justify-between rounded-xl border p-5 ${getStatusClassBorder(order.statusId)}`}>
      <Link href={`/dashboard/order/${order.orderNumber}`} className='flex flex-col gap-3'>
        <div className={`flex items-center gap-2 text-sm ${getStatusClassLabel(order.statusId)}`}>
          <Icon
            IconComponent={getStatusIcon(order.statusId)}
            className={`rounded-full p-1 ${getStatusClassIcon(order.statusId)}`}
            variant='Linear'
            size={32}
          />
          {order.statusTitle}
        </div>

        <div className='flex items-center max-lg:flex-col max-lg:items-start gap-3 text-sm'>
          <div className='flex items-center gap-1'>
            <span className='text-secondary-3'>{order.createdAt}</span>
          </div>

          <div className='flex items-center gap-1'>
            <span className='text-secondary-3'>کد سفارش:</span>
            <span className='font-medium text-secondary-1'>{order.orderNumber}</span>
          </div>

          <div className='flex items-center gap-1'>
            <span className='text-secondary-3'>مبلغ:</span>
            <span className='font-medium text-secondary-1'>{formatPrice(order.price.totalPrice)}</span>
            <div className='flex flex-col items-end text-secondary-3 text-[0.7rem] leading-2 relative top-[-0.05rem]'>
              <CurrencyLabel />
            </div>
          </div>
        </div>
      </Link>

      <div className='flex flex-col items-end gap-2'>
        <Link href={`/dashboard/order/${order.orderNumber}`} className='rounded-lg p-1 cursor-pointer transition-colors hover:bg-gray-100'>
          <Icon IconComponent={ArrowLeft2} className='text-secondary-1' variant='Linear' size={15} />
        </Link>

        {/* {order.statusId === -1 && (
          <Link
            href={`/`}
            className='rounded-lg w-25 h-10 flex items-center justify-center text-xs text-primary-0 border border-primary-0 transition-colors hover:bg-primary-0/10'>
            ادامه پرداخت
          </Link>
        )} */}

      </div>
    </div>
  );
}
