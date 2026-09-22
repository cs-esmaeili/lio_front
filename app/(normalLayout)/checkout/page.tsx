'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AuthGuard from '@/components/global/AuthGuard';
import CheckoutList from '@/components/shop/checkout/CheckoutList';
import CheckoutSummary from '@/components/shop/checkout/CheckoutSummary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs';
import { useCart } from '@/hooks/cart/useCart';
import AddressSection from '@/components/shop/checkout/AddressSection';
import PaymentSection, { CARD_TO_CARD_PAYMENT_ID } from '@/components/shop/checkout/PaymentSection';
import ShippingMethodSection from '@/components/shop/checkout/ShippingMethodSection';
import type { Address } from '@/components/dashboard/address/address.model';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

import { useCheckoutStepper } from '@/hooks/checkout/useCheckoutStepper';
import { useCheckoutStore } from '@/stores/checkoutStore';

type CheckoutTab = 'address';

export default function PurchaseBasketPage() {
  const router = useRouter();
  const { items: cartItems, updatingVariants, refetch } = useCart();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const items = cartItems.map((ci) => ({
    ...ci,
    isUpdating: updatingVariants.has(ci.variantId),
  }));

  // ---- tab state ----

  const [activeTab, setActiveTab] = useState<CheckoutTab>('address');

  // ---- address state (synced from AddressSection) ----

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();

  const handleAddressesChange = useCallback((addrs: Address[]) => {
    setAddresses(addrs);
  }, []);

  // ---- stepper (drives the flow) ----

  const stepper = useCheckoutStepper();
  const stepperRef = useRef(stepper);
  stepperRef.current = stepper;

  // ---- checkout store ----

  const {
    shippingMethods,
    paymentMethods,
    wallet,
    showCouponBox,
    cardMethods,
    paymentMethodsData,
    selectedShippingMethodId,
    selectedPaymentMethodId,
    couponCode,
    shippingCostLoading,
    couponLoading,
    couponCart,
    paymentCart,
    paymentSummaryLoading,
    setSelectedAddressId: setSelectedAddressIdStore,
    setSelectedPaymentMethod,
    setCouponCode,
    reset: resetCheckoutStore,
  } = useCheckoutStore();

  // ---- address selection → stepper fires immediately ----
  // Uses ref for stepper so callback reference stays stable across renders.
  // Prevents AddressSection's sync useEffect from re-firing on every store update.

  const handleSelectionChange = useCallback((id: string | undefined) => {
    setSelectedAddressId(id);
    const numId = id ? Number(id) : undefined;
    if (numId && Number.isFinite(numId) && numId > 0) {
      setSelectedAddressIdStore(numId);
      stepperRef.current.onAddressSelected(numId);
    } else {
      setSelectedAddressIdStore(undefined);
    }
  }, [setSelectedAddressIdStore]);

  // ---- address edit → re-fetch ----

  const editAddressId = stepper.editAddressId;

  const handleAddressSaved = useCallback(() => {
    stepperRef.current.onAddressSaved();
  }, []);

  // ---- cleanup store on unmount ----

  useEffect(() => {
    return () => {
      resetCheckoutStore();
    };
  }, [resetCheckoutStore]);

  // ---- validation ----

  const isAddressSelected = !!selectedAddressId;

  // ---- derived data ----

  const summaryCart = couponCart ?? paymentCart;
  const basePrice = summaryCart?.base_price ?? 0;
  const discount = summaryCart?.discount ?? 0;
  const postPrice = summaryCart?.post_price ?? 0;
  const paymentPrice = summaryCart?.payment_price ?? 0;
  const itemCount = summaryCart?.items_count ?? 0;
  const maxPersent = summaryCart?.max_persent ?? 0;
  const remaining = summaryCart?.remaining ?? 0;
  const maxPrice = summaryCart?.max_price ?? 0;


  return (
    <AuthGuard>
      <div className='container' dir='rtl'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-10'>
          {/* Right column */}
          <div className='order-2 md:order-1 md:col-span-2'>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CheckoutTab)} dir='rtl'>
              <TabsList variant='line' className='flex-row w-full justify-start gap-4 border-b-1 border-gray-2' dir='rtl'>
                <TabsTrigger
                  value='basket'
                  onClick={() => router.push('/basket')}
                  className='flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1 pb-3'>
                  <Icon
                    IconComponent={ArrowRight}
                    className='text-secondary-black-3 rounded-lg p-1 bg-gray-100 !w-7 !h-7'
                    size={25}
                    aria-hidden='true'
                    variant='TwoTone'
                    toneTwoColor='--color-primary-1'
                  />
                  سبد خرید
                </TabsTrigger>

                <TabsTrigger
                  value='address'
                  className='flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1 pb-3'>
                  <Icon
                    IconComponent={ArrowRight}
                    className='text-secondary-black-3 rounded-lg p-1 bg-gray-100 !w-7 !h-7'
                    size={25}
                    aria-hidden='true'
                    variant='TwoTone'
                    toneTwoColor='--color-primary-1'
                  />
                  اطلاعات آدرس
                </TabsTrigger>
              </TabsList>

              <TabsContent value='address' dir='rtl'>
                <AddressSection
                  onAddressesChange={handleAddressesChange}
                  onSelectionChange={handleSelectionChange}
                  editAddressId={editAddressId}
                  onEditAddressHandled={stepper.clearPaymentError}
                  onAddressSaved={handleAddressSaved}
                />

                <ShippingMethodSection
                  shippingMethods={shippingMethods}
                  selectedShippingMethodId={selectedShippingMethodId}
                  onSelect={stepper.onShippingSelected}
                  loading={shippingCostLoading}
                />
              </TabsContent>
            </Tabs>

            <span className='block border-b border-primary-3 mt-8 mb-6 pb-2 text-body'>سفارش شما</span>
            <CheckoutList items={items} />
          </div>

          {/* Left column: Order Summary */}
          <div className='order-2 md:order-2 md:col-span-1 flex flex-col gap-4 sticky top-24'>
            <div className='relative'>
            <PaymentSection
              showCouponBox={showCouponBox}
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
              couponLoading={couponLoading}
              onApplyCoupon={stepper.applyCoupon}
              canApplyCoupon={!!selectedShippingMethodId && stepper.editAddressId == null && !!couponCode.trim()}
              couponCart={couponCart}
              onRemoveCoupon={stepper.removeCoupon}
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onPaymentMethodChange={setSelectedPaymentMethod}
              cardMethods={cardMethods}
              paymentMethodsData={paymentMethodsData}
              onTransactionFileSelect={stepper.setTransactionFile}
            />

            <div className='flex flex-col gap-4'>

              <CheckoutSummary
                basePrice={basePrice}
                discount={discount}
                postPrice={postPrice}
                paymentPrice={paymentPrice}
                itemCount={itemCount}
                couponAmount={summaryCart?.coupon_amount}
                discountCard={selectedPaymentMethodId === CARD_TO_CARD_PAYMENT_ID ? (summaryCart?.discount_card ?? 0) : 0}
                isCardToCard={selectedPaymentMethodId === CARD_TO_CARD_PAYMENT_ID}
                maxPersent={maxPersent}
                remaining={remaining}
                maxPrice={maxPrice}
                desktopButtonText={stepper.isPaying ? 'در حال اتصال...' : 'پرداخت'}
                mobileButtonText={stepper.isPaying ? 'در حال اتصال...' : 'پرداخت'}
                buttonHref='#'
                onButtonClick={stepper.onPay}
                buttonDisabled={stepper.buttonDisabled}
                wallet={wallet}
              />

              {(!selectedAddressId || selectedShippingMethodId === null) && (
                <div className='absolute inset-0 backdrop-blur-sm bg-white/40 rounded-2xl flex items-center justify-center z-10'>
                  <div className='text-center px-6 py-8'>
                    <p className='text-secondary-black-1 text-body font-medium'>
                      لطفا آدرس و روش ارسال را انتخاب کنید
                    </p>
                    <p className='text-secondary-2 text-sm mt-2'>
                      پس از انتخاب آدرس و روش ارسال، اطلاعات پرداخت نمایش داده می‌شود
                    </p>
                  </div>
                </div>
              )}

            </div>

            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
