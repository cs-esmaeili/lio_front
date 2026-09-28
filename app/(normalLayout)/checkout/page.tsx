'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import AuthGuard from '@/components/global/AuthGuard';
import AddressSection from '@/components/shop/checkout/AddressSection';
import CheckoutList from '@/components/shop/checkout/CheckoutList';
import CheckoutSummary from '@/components/shop/checkout/CheckoutSummary';
import ProfileEditDialog from '@/components/shop/checkout/ProfileEditDialog';
import { Spinner } from '@/components/shadcn/spinner';

import { useCheckout } from '@/hooks/checkout/useCheckout';
import { usePayment } from '@/hooks/payment/usePayment';

import type { PaymentEligibilityReason } from '@/typescript/schemas/payment-eligibility.schema';

export default function CheckoutPage() {
  const { checkout, loading, selectedAddressId, refetch, selectAddress } = useCheckout();
  const { startPayment, pending } = usePayment();

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [eligibilityReasons, setEligibilityReasons] = useState<PaymentEligibilityReason[]>([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const openProfileDialog = useCallback((reasons: PaymentEligibilityReason[]): void => {
    setEligibilityReasons(reasons);
    setProfileDialogOpen(true);
  }, []);

  const handlePayment = useCallback((): void => {
    if (selectedAddressId == null) {
      toast.error('لطفاً ابتدا آدرس تحویل را انتخاب کنید.');
      return;
    }

    // The eligibility gate is server-owned: only the backend decides. When the
    // last `GET /checkout` already says "not eligible", open the completion
    // dialog instead of firing a request that is guaranteed to 409.
    if (checkout && !checkout.paymentEligibility.eligible) {
      openProfileDialog(checkout.paymentEligibility.reasons);
      return;
    }

    void startPayment(Number(selectedAddressId)).then((result) => {
      // Eligibility may have changed between load and click — the 409 reasons
      // are authoritative and carry the same shape.
      if (result.status === 'not-allowed') openProfileDialog(result.reasons);
    });
  }, [checkout, selectedAddressId, startPayment, openProfileDialog]);

  const handleProfileSaved = useCallback((): void => {
    setProfileDialogOpen(false);
    // Re-read the server-owned eligibility so the next "pay" attempt goes through.
    void refetch();
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
              <CheckoutSummary
                checkout={checkout}
                buttonDisabled={checkout.itemCount === 0 || selectedAddressId == null}
                buttonLoading={pending}
                onButtonClick={handlePayment}
              />
            </div>
          )}
        </div>

        <ProfileEditDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          reasons={eligibilityReasons}
          onSaved={handleProfileSaved}
        />
      </div>
    </AuthGuard>
  );
}
