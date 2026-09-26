'use client';

import { useEffect } from 'react';
import BasketList from '@/components/shop/basket/BasketList';
import OrderSummary from '@/components/shop/basket/OrderSummary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs';
import { useCart } from '@/hooks/cart/useCart';
import { Spinner } from '@/components/shadcn/spinner';

export default function PurchaseBasketPage() {
  const { loading, items, updatingVariants, updateQuantity, removeItem, refetch, subtotal, totalDiscount, itemCount } =
    useCart();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const basketItems = items.map((item) => ({
    ...item,
    isUpdating: updatingVariants.has(item.variantId),
  }));

  const handleQuantityChange = (id: string, newQuantity: number) => {
    void updateQuantity(Number(id), newQuantity);
  };

  const handleRemove = (id: string) => {
    void removeItem(Number(id));
  };

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
                  items={basketItems}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
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
            finalPrice={subtotal}
            discount={totalDiscount}
            paymentPrice={subtotal}
            itemCount={itemCount}
            basePrice={subtotal + totalDiscount}
            desktopButtonText='تایید و تکمیل سفارش'
            mobileButtonText='تایید سفارش'
          />
        </div>
      </div>
    </div>
  );
}
