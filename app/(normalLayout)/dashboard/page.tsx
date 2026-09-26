'use client';

import Image from 'next/image';

import Icon from '@/components/global/Icon';
import PageHeader from '@/components/dashboard/PageHeader';
// import ProductListItem from '@/components/dashboard/product/ProductListItem';
import OrderStatCard from '@/components/dashboard/order/OrderStatCard';
import emptyData from '@/public/icons/empty-data.svg';
// import OrderTrackingForm from '@/components/dashboard/order/OrderTrackingForm';

import { ShoppingCart } from 'iconsax-reactjs';

import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { Spinner } from '@/components/shadcn/spinner';

export default function DashboardHome() {
  const pageInfo = {
    recentOrder: {
      href: '/dashboard',
      label: 'اطلاعات سفارش ها',
      icon: ShoppingCart,
    },

    // orderTracking: {
    //   href: '/dashboard/tracking',
    //   label: 'پیگیری سفارش',
    //   icon: TruckTime,
    // },

    // recentViews: {
    //   href: '/dashboard',
    //   label: 'محصولات مورد علاقه',
    //   icon: Heart,
    // },
  };

  const { dashboard, loading } = useDashboard();

  const orderStatusConfig = [
    { key: 'progress', statusId: 0 },
    { key: 'delivered', statusId: 2 },
    { key: 'cancel', statusId: 4 },
    { key: 'awaiting_payment', statusId: -1 },
    { key: 'in_progress', statusId: 1 },
    { key: 'awaiting_card_confirmation', statusId: 3 },
    { key: 'sent_to_warehouse', statusId: 5 },
    { key: 'shipped', statusId: 6 },
    { key: 'partially_shipped', statusId: 6 },
    { key: 'canceled', statusId: 4 },
    { key: 'refunded', statusId: 6 },
  ];

  const orderStats = orderStatusConfig
    .map(({ key, statusId }) => {
      const order = dashboard?.orders?.[key as keyof typeof dashboard.orders];

      if (!order) return null;

      return {
        ...order,
        statusId,
      };
    })
    .filter(
      (
        item
      ): item is {
        title: string;
        count: number;
        statusId: number;
      } => item !== null
    );

  // const favoriteProducts = dashboard?.favorites ?? [];

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full flex-col gap-3 rounded-xl border-2 border-gray-1 p-6 sm:p-4'>
        <PageHeader
          className='mb-2 sm:mb-4'
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={pageInfo.recentOrder.icon}
                className='text-secondary-black-3 transition-colors duration-200'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />

              <span className='text-regular text-secondary-1'>{pageInfo.recentOrder.label}</span>
            </div>
          }
        />

        {loading ? (
          <div className='flex w-full items-center justify-center py-16'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : orderStats.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-1 py-12 text-center'>
            <div className='relative mb-4 h-20 w-20'>
              <Image src={emptyData} alt='No orders' fill className='object-contain' sizes='80px' />
            </div>

            <h6 className='text-gray-3'>سفارشی وجود ندارد</h6>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-hidden rounded-xl'>
            {orderStats.map((item) => (
              <div key={`${item.statusId}-${item.title}`} className='flex flex-1'>
                <OrderStatCard title={item.title} count={item.count} statusId={item.statusId} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order tracking — disabled for now
      <div className='flex w-full flex-col gap-3 rounded-xl border-2 border-gray-1 p-6 sm:p-4'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={pageInfo.orderTracking.icon}
                className='text-secondary-black-3 transition-colors duration-200'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />

              <span className='text-regular text-secondary-1'>{pageInfo.orderTracking.label}</span>
            </div>
          }
        />
        <OrderTrackingForm />
      </div>
      */}

      {/* Favorite products — disabled for now
      <div className='flex w-full flex-col gap-3 rounded-xl border-2 border-gray-1 p-6 sm:p-4'>
        <PageHeader
          className='mb-2 sm:mb-4'
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={pageInfo.recentViews.icon}
                className='text-secondary-black-3 transition-colors duration-200'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />

              <span className='text-regular text-secondary-1'>{pageInfo.recentViews.label}</span>
            </div>
          }
        />

        {loading ? (
          <div className='flex w-full items-center justify-center py-20'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className='flex w-full flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 py-8 text-center sm:py-12'>
            <div className='relative mb-3 h-16 w-16 sm:mb-4 sm:h-20 sm:w-20'>
              <Image src={emptyData} alt='No favorite products' fill className='object-contain' sizes='80px' />
            </div>

            <h6 className='text-sm text-gray-3 sm:text-base'>محصولی در لیست علاقمندی ها نیست</h6>
          </div>
        ) : (
          <div className='flex w-full flex-wrap overflow-hidden'>
            {favoriteProducts.map((product: any) => (
              <div key={product.id} className='min-w-0 w-full sm:w-1/2 lg:w-1/3'>
                <div className='h-full overflow-hidden border border-gray-200'>
                  <ProductListItem
                    id={product.id}
                    name={product.title}
                    image={product.image}
                    price={product.default_variant.final_amount}
                    originalPrice={product.default_variant.amount}
                    discountPercent={product.default_variant.discount_percent}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      */}
    </div>
  );
}
