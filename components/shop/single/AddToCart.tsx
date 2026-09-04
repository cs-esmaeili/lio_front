'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shadcn/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { QuantitySelector } from '@/components/shop/single/QuantitySelector';
import Image from 'next/image';
import Icon from '@/components/global/Icon';
import { TickSquare } from 'iconsax-reactjs';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { separator } from '@/utils/number';
import { useMatchedPrice } from '@/hooks/shop/useMatchedPrice';
import { useCart } from '@/hooks/shop/useCart';
import { useCartStore } from '@/stores/cartStore';
import { useBasketUIStore } from '@/stores/basketUIStore';
import { Spinner } from '@/components/shadcn/spinner';
import CallSocial from '@/components/global/CallSocial';
import { useAuth } from '@/hooks/useAuth';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import NotifyProductModalContent from '@/components/shop/single/NotifyProductModalContent';
import { productNotificationCSR, removeProductNotificationCSR } from '@/services/productNotification.service';

type AddToCartProps = {
  showProductInfo?: boolean;
  productImage?: string;
  productName?: string;
  baseAttributes?: any;
  prices?: any;
  product?: any;
  callToAction?: any;
  socialToAction?: any;
};

const AddToCart = ({
  showProductInfo = true,
  productImage,
  productName,
  baseAttributes,
  prices,
  product,
  callToAction,
  socialToAction,
}: AddToCartProps) => {
  const { isHydrated, isLoggedIn } = useAuth();

  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notificationOptions, setNotificationOptions] = useState<any[]>([]);
  const [hasNotification, setHasNotification] = useState(false);
  const [checkingNotification, setCheckingNotification] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      setCheckingNotification(false);
      setHasNotification(false);
      return;
    }

    if (!product?.barcode || !product?.default_variant?.id) {
      setHasNotification(false);
      setCheckingNotification(false);
      return;
    }

    const checkNotification = async () => {
      try {
        setCheckingNotification(true);

        const response = await productNotificationCSR(product.barcode, product.default_variant.id);

        const data = response.data?.data;

        setHasNotification(!Array.isArray(data) && data?.active_notification === true);
      } catch (error) {
        console.error('product notification check error:', error);
        setHasNotification(false);
      } finally {
        setCheckingNotification(false);
      }
    };

    checkNotification();
  }, [isHydrated, isLoggedIn, product?.barcode, product?.default_variant?.id]);

  const { matchedPrice, status, hasDiscount, isComplete, selectedValueIds, handleValueChange } = useMatchedPrice({
    baseAttributes,
    prices,
    defaultVariant: product?.default_variant,
  });

  const [count, setCount] = useState(matchedPrice?.min_order || 1);

  const isAvailable = status === 'available';
  const isCall = status === 'call';
  const disableSelects = isComplete && !isAvailable;

  const { addToCart, addToCartLoading, updateQuantity, updatingItems, removeItem } = useCart();
  const cartItems = useCartStore((s) => s.items);
  const openBasket = useBasketUIStore((s) => s.open);

  const cartQuantity = matchedPrice ? (cartItems.find((i) => i.variant_id === matchedPrice.id)?.quantity ?? 0) : 0;
  const isInCart = cartQuantity > 0;
  const isUpdating = matchedPrice ? updatingItems.has(matchedPrice.id) : false;

  useEffect(() => {
    setCount(matchedPrice?.min_order ?? 1);
  }, [matchedPrice?.id]);

  const handleAddToCart = () => {
    if (!matchedPrice || !product?.id) return;
    addToCart(matchedPrice.id, product.id, count, matchedPrice.max_order);
  };

  const handleNotifyClick = async () => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      const returnUrl = window.location.pathname + window.location.search;

      window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    }

    if (!product?.barcode || !product?.default_variant?.id) {
      return;
    }

    try {
      const response = await productNotificationCSR(product.barcode, product.default_variant.id);

      const data = response.data?.data;

      if (!Array.isArray(data) && data?.active_notification === true) {
        setHasNotification(true);
        return;
      }

      if (Array.isArray(data)) {
        setNotificationOptions(data);
        setHasNotification(false);
        setNotifyModalOpen(true);
        return;
      }
    } catch (error) {
      console.error('product notification error:', error);
    }
  };

  const handleRemoveNotification = async () => {
    if (!product?.barcode || !product?.default_variant?.id) {
      return;
    }

    try {
      const response = await removeProductNotificationCSR(product.barcode, product.default_variant.id);

      if (response.data?.status === 200) {
        setHasNotification(false);
      }
    } catch (error) {
      console.error('remove product notification error:', error);
    }
  };

  const btnClass = 'w-full h-12 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white';

  return (
    <div className='flex flex-col gap-4 mt-5 bg-gray-1 rounded-[20px] pt-9 pb-6 px-4'>
      {/* Product info (optional) */}
      {showProductInfo && productImage && productName && (
        <div className='flex items-center gap-3 pb-4 mb-2'>
          <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0'>
            <Image src={productImage} alt={productName} fill className='object-cover' />
          </div>
          <div>
            <h4 className='font-semibold text-gray-800 line-clamp-2'>{productName}</h4>
          </div>
        </div>
      )}

      {/* Dynamic attribute selects — one per baseAttribute */}
      <div className='space-y-4'>
        {baseAttributes?.map((attr: any, index: number) => (
          <div key={attr.id} className='relative'>
            <label className='absolute right-3 text-secondary-2 pointer-events-none transition-all duration-200 z-10 bg-gray-1 px-1 -top-2 text-xs'>
              انتخاب {attr.title}
            </label>
            <Select
              value={selectedValueIds[index] ? String(selectedValueIds[index]) : ''}
              onValueChange={(val) => handleValueChange(index, val)}
              disabled={disableSelects}>
              <SelectTrigger className='h-12 rounded-lg w-full py-5 px-3 border border-secondary-2' dir='rtl'>
                <SelectValue placeholder='' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-50' dir='rtl' onCloseAutoFocus={(e) => e.preventDefault()}>
                {attr.values?.map((val: any) => (
                  <SelectItem key={val.id} value={String(val.id)}>
                    {val.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* COUNTER + STOCK — only when available */}
      {isAvailable && matchedPrice && (
        <div className='flex items-center justify-between'>
          <div className='flex gap-0.5 items-center text-sm'>
            <Icon IconComponent={TickSquare} className='text-primary-0' size={20} variant='Bold' toneTwoColor='--color-primary-0' />
            <span className='text-secondary-black-1'>موجود در انبار</span>
          </div>

          <QuantitySelector
            value={isInCart ? cartQuantity : count}
            onChange={(newQty) => {
              if (isInCart) {
                updateQuantity(matchedPrice.id, newQty);
              } else {
                setCount(newQty);
              }
            }}
            min={matchedPrice.min_order ?? 1}
            max={matchedPrice.max_order}
            size='sm'
            disabled={isUpdating || addToCartLoading}
            loading={isUpdating || addToCartLoading}
            onRemove={isInCart ? () => removeItem(matchedPrice.id) : undefined}
          />
        </div>
      )}

      {/* PRICE — only when available */}
      {isAvailable && matchedPrice && (
        <div className='flex flex-row justify-end items-start gap-1 text-sm text-secondary-black-1'>
          {hasDiscount && (
            <>
              <span className='line-through text-secondary-2'>{separator(matchedPrice.amount)}</span>
              <span className='text-secondary-2'>|</span>
            </>
          )}
          <span>{separator(matchedPrice.final_amount)}</span>
          <div className='text-secondary-2 flex flex-col items-end text-[0.7rem] leading-2'>
            <CurrencyLabel />
          </div>
        </div>
      )}

      {/* BUTTON — based on productStatus + loading states */}
      {isComplete && isCall ? (
        <a href={`tel:${callToAction}`}>
          <Button className={btnClass}>تماس بگیرید</Button>
        </a>
      ) : isComplete && isAvailable && isInCart && isUpdating ? (
        <Button className={btnClass} disabled>
          <span className='flex items-center gap-2'>
            <Spinner className='size-5' />
            در حال بروزرسانی...
          </span>
        </Button>
      ) : isComplete && isAvailable && isInCart ? (
        <Button className={btnClass} onClick={openBasket}>
          مشاهده سبد خرید
        </Button>
      ) : isComplete && isAvailable ? (
        <Button className={btnClass} onClick={handleAddToCart} disabled={addToCartLoading}>
          {addToCartLoading ? (
            <span className='flex items-center gap-2'>
              <Spinner className='size-5' />
              در حال افزودن...
            </span>
          ) : (
            'افزودن به سبد خرید'
          )}
        </Button>
      ) : checkingNotification ? (
        <Button className={btnClass} disabled>
          <span className='flex items-center gap-2'>
            <Spinner className='size-5' />
            در حال بررسی...
          </span>
        </Button>
      ) : hasNotification ? (
        <Button className={btnClass} onClick={handleRemoveNotification}>
          نیازی نیست اطلاع بدی!
        </Button>
      ) : (
        <Button className={btnClass} onClick={handleNotifyClick}>
          خبرم کن
        </Button>
      )}

      {/* SUPPORT TEXT */}
      <div className='text-sm text-secondary-black-1'>سوالت رو اینجا بپرس!</div>

      {/* SOCIALS */}
      <div className='flex items-center justify-center flex-wrap gap-4'>
        <CallSocial communications={socialToAction} />
      </div>

      <ReusableModal open={notifyModalOpen} onOpenChange={setNotifyModalOpen} title='خبرم کن' size='md'>
        <NotifyProductModalContent
          options={notificationOptions}
          barcode={product?.barcode}
          variantId={product?.default_variant?.id}
          onSuccess={() => {
            setHasNotification(true);
            setNotifyModalOpen(false);
          }}
        />
      </ReusableModal>
    </div>
  );
};

export default AddToCart;
