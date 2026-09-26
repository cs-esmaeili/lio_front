'use client';

import { useEffect } from 'react';

import AuthGuard from '@/components/global/AuthGuard';
import AddressSection from '@/components/shop/checkout/AddressSection';
import CheckoutList from '@/components/shop/checkout/CheckoutList';
import CheckoutSummary from '@/components/shop/checkout/CheckoutSummary';
import { Spinner } from '@/components/shadcn/spinner';

import { useCheckout } from '@/hooks/checkout/useCheckout';

export default function CheckoutPage() {
  const { checkout, loading, selectedAddressId, refetch, selectAddress } = useCheckout();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <AuthGuard>
      <div className='container' dir='rtl'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-10'>
          {/* Right column: address + items */}
          <div className='order-2 md:order-1 md:col-span-2'>
            {loading && !checkout && (
              <div className='flex items-center justify-center py-20'>
                <Spinner className='size-8' />
              </div>
            )}

            {!loading && !checkout && (
              <div className='rounded-2xl border border-dashed border-gray-300 p-10 text-center text-secondary-2'>
                دریافت اطلاعات سفارش ناموفق بود.
              </div>
            )}

            {checkout && (
              <>
                <AddressSection
                  addresses={checkout.addresses}
                  selectedAddressId={selectedAddressId}
                  onSelect={selectAddress}
                  onAddressesChanged={refetch}
                />

                <span className='block border-b border-primary-3 mt-8 mb-6 pb-2 text-body'>سفارش شما</span>
                <CheckoutList items={checkout.items} />
              </>
            )}
          </div>

          {/* Left column: pricing summary */}
          {checkout && (
            <div className='order-2 md:order-2 md:col-span-1 flex flex-col gap-4 sticky top-24'>
              <CheckoutSummary checkout={checkout} buttonDisabled />
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
