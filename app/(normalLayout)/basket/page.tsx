'use client';

import { useEffect } from 'react';
import BasketList from '@/components/shop/basket/BasketList';
import OrderSummary from '@/components/shop/basket/OrderSummary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs';
import AstelamCard from '@/components/global/Cards/AstelamCard';
import { useCart } from '@/hooks/shop/useCart';
import { Spinner } from '@/components/shadcn/spinner';
import { useNextPurchaseStore } from '@/stores/nextPurchaseStore';

export default function PurchaseBasketPage() {
  const { loading, isEmpty, cartItems, cartSummary, updatingItems, updateQuantity, removeItem, refetch } = useCart();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const items = cartItems.map((ci) => ({
    ...ci,
    isUpdating: updatingItems.has(ci.product.product_price_id),
  }));

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(Number(id), newQuantity);
  };

  const handleRemove = (id: string) => {
    removeItem(Number(id));
  };

  const handleMoveToNextPurchase = (id: string) => {
    // Move item to next-purchase list, then remove from cart
    const item = cartItems.find((ci) => String(ci.product.product_price_id) === id);
    if (item) {
      useNextPurchaseStore.getState().addItem(item);
      removeItem(Number(id));
    }
  };

  const final_price = cartSummary?.final_price ?? 0;
  const discount = cartSummary?.discount ?? 0;
  const payment_price = cartSummary?.payment_price ?? 0;
  const base_price = cartSummary?.base_price ?? 0;
  const itemCount = cartSummary?.items_count ?? 0;
  const max_persent = cartSummary?.max_persent ?? 0;
  const remaining = cartSummary?.remaining ?? 0;
  const max_price = cartSummary?.max_price ?? 0;

  return (
    <div className='container' dir='rtl'>
      {/* No inner max‑width wrapper – grid spans full width */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-10'>
        {/* Right column: Tabs + BasketList (2/3 width) */}
        <div className='order-2 md:order-1 md:col-span-2'>
          <Tabs defaultValue='overview' dir='rtl'>
            <TabsList variant='line' className='flex-row w-full justify-start gap-4 border-b border-gray-2' dir='rtl'>
              <TabsTrigger
                value='overview'
                className='flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1 pb-3'>
                سبد خرید
              </TabsTrigger>
              {/* <TabsTrigger
                value='analytics'
                className='flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1 pb-3'>
                خرید بعدی
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value='overview' dir='rtl'>
              {loading ? (
                <div className='flex items-center justify-center py-10'>
                  <Spinner className='size-8' />
                </div>
              ) : (
                <BasketList
                  items={items}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onMoveToNextPurchase={handleMoveToNextPurchase}
                />
              )}
            </TabsContent>

            <TabsContent value='analytics' dir='rtl'>
              <div className='text-center py-12 text-gray-400'>این بخش به زودی فعال می‌شود</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Left column: Order Summary (1/3 width) */}
        <div className='order-2 md:order-2 md:col-span-1 flex flex-col gap-4 sticky top-4'>
          <OrderSummary
            finalPrice={final_price}
            discount={discount}
            paymentPrice={payment_price}
            itemCount={itemCount}
            basePrice={base_price}
            maxPersent={max_persent}
            remaining={remaining}
            maxPrice={max_price}
            desktopButtonText='تایید و تکمیل سفارش'
            mobileButtonText='تایید سفارش'
          />
          {/* <AstelamCard /> */}
        </div>
      </div>

      {/* Action buttons row – commented out, keep as is */}
    </div>
  );
}
