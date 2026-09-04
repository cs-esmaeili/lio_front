'use client';

import Image from 'next/image';

import OrderInfo from '@/components/dashboard/order/OrderInfo';
import OrderInvoice from '@/components/dashboard/order/OrderInvoice';
import OrderItem from '@/components/dashboard/order/OrderItem';
import PageHeader from '@/components/dashboard/PageHeader';
import Icon from '@/components/global/Icon';

import type { Order } from '@/components/dashboard/order/order.model';
import { ArrowSquareRight } from 'iconsax-reactjs';

import { useRouter } from 'next/navigation';

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard/order/');
    }
  };

  const receiverInfo = [
    {
      title: 'تحویل گیرنده:',
      value: order.customer.name || '-',
    },
    {
      title: 'شماره تماس:',
      value: order.customer.mobile || '-',
    },
  ];

  const orderInfo = [
    {
      title: 'شماره سفارش:',
      value: order.orderNumber,
    },
    {
      title: 'تاریخ ثبت:',
      value: order.createdAt,
    },
    {
      title: 'وضعیت سفارش:',
      value: order.statusTitle,
    },
    {
      title: 'روش ارسال:',
      value: order.shipping.method,
    },
    {
      title: 'کد رهگیری:',
      value: order.shipping.trackingCode || '-',
    },

    ...(order.price.cardDiscount
      ? [
          {
            title: 'تخفیف کارت به کارت:',
            value: (
              <>
                {order.price.cardDiscount.toLocaleString()} {order.price.currency}
              </>
            ),
          },
        ]
      : []),

    ...(order.price.transactionFile
      ? [
          {
            title: 'رسید کارت به کارت:',
            value: (
              <a href={order.price.transactionFile} target='_blank' rel='noopener noreferrer' className='block w-fit'>
                <Image
                  src={order.price.transactionFile}
                  alt='رسید کارت به کارت'
                  width={120}
                  height={120}
                  className='h-24 w-24 rounded-lg border object-cover'
                />
              </a>
            ),
          },
        ]
      : []),
  ];

  //------------------------------------------------------

  return (
    <div className='flex flex-col gap-6 text-sm'>
      <div className='rounded-xl border-2 border-gray-1 p-5'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <span
                onClick={handleBack}
                className='hidden md:flex items-center justify-center rounded-lg bg-primary-4 w-9 h-9 relative cursor-pointer'>
                <Icon
                  IconComponent={ArrowSquareRight}
                  className='text-primary-1'
                  size={24}
                  aria-hidden='true'
                  variant='TwoTone'
                  toneTwoColor='--color-secondary-black-3'
                />
              </span>

              <span className='text-regular text-secondary-1'>جزئیات سفارش</span>
            </div>
          }
        />

        <div className='flex flex-wrap gap-y-5 gap-x-10 xl:gap-x-35 border-b border-gray-200 py-4'>
          {orderInfo.map((item) => (
            <OrderInfo key={item.title} title={item.title} value={item.value} />
          ))}
        </div>

        <div className='flex flex-wrap gap-y-5 gap-x-10 xl:gap-x-35 border-b border-gray-200 py-4'>
          {receiverInfo.map((item) => (
            <OrderInfo key={item.title} title={item.title} value={item.value} />
          ))}
        </div>

        <div className='flex flex-wrap gap-y-5 gap-x-10 xl:gap-x-35 border-b border-gray-200 py-4'>
          <OrderInfo title='آدرس:' value={order.customer.address || '-'} />
        </div>
      </div>

      <div className='rounded-xl border-2 border-gray-1 p-5'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <span className='text-regular text-secondary-1'>مرسولات سفارشی</span>
            </div>
          }
        />

        <div className='flex flex-col'>
          {order.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className='rounded-xl border border-primary-1 bg-primary-4/30 p-5'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <span className='text-regular text-secondary-1'>خلاصه فاکتور</span>
            </div>
          }
        />

        <div className='flex flex-col gap-3'>
          <OrderInvoice
            subtotal={order.price.subtotal}
            shippingCost={order.price.shippingCost}
            discount={order.price.discount + order.price.coupon}
            totalPrice={order.price.totalPrice}
            currency={order.price.currency}
          />
        </div>
      </div>
    </div>
  );
}
