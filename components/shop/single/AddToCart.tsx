'use client';

import { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { QuantitySelector } from '@/components/shop/single/QuantitySelector';
import Image from 'next/image';
import Icon from '@/components/global/Icon';
import { TickSquare } from 'iconsax-reactjs';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { separator } from '@/utils/number';
import CallSocial from '@/components/global/CallSocial';
import { useMatchedVariant } from '@/hooks/shop/useMatchedVariant';
import { useCart } from '@/hooks/cart/useCart';
import type {
  BaseAttribute,
  ProductDetailsProduct,
  ProductVariant,
} from '@/typescript/schemas/products/product-details.schema';
import type { FooterCommunication } from '@/typescript/types/footer/footer.types';

/**
 * Adds the product to the cart through the single `useCart` hook. Uses the
 * resolved `matchedVariant.id` (the cart key is `variantId`, never `productId`).
 */
const AddToCart = ({
  showProductInfo = true,
  productImage,
  productName,
  baseAttributes,
  variants,
  product,
  callToAction,
  socialToAction = [],
}: {
  showProductInfo?: boolean;
  productImage?: string;
  productName?: string;
  baseAttributes: BaseAttribute[];
  variants: ProductVariant[];
  product: ProductDetailsProduct;
  callToAction?: string;
  socialToAction?: FooterCommunication[];
}) => {
  const { matchedVariant, selectedValueIds, handleValueChange, isComplete } = useMatchedVariant({
    baseAttributes,
    variants,
    defaultVariant: product.defaultVariant,
  });

  const [count, setCount] = useState(1);

  const { addItem, addToCartLoading } = useCart();

  const onValueChange = (attributeId: number, valueId: string) => {
    setCount(1);
    handleValueChange(attributeId, valueId);
  };

  const handleAddToCart = () => {
    if (!matchedVariant) return;
    void addItem(matchedVariant.id, count, matchedVariant.stock > 0 ? matchedVariant.stock : undefined);
  };

  const isCall = matchedVariant?.zeroPrice === 'call';
  const isAvailable = !!matchedVariant?.isAvailable && !isCall;
  const hasDiscount =
    !!matchedVariant && (matchedVariant.compareAtPrice ?? 0) > matchedVariant.price && matchedVariant.price > 0;

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
        {baseAttributes.map((attribute) => (
          <div key={attribute.attributeId} className='relative'>
            <label className='absolute right-3 text-secondary-2 pointer-events-none transition-all duration-200 z-10 bg-gray-1 px-1 -top-2 text-xs'>
              انتخاب {attribute.title}
            </label>
            <Select
              value={selectedValueIds[attribute.attributeId] ? String(selectedValueIds[attribute.attributeId]) : ''}
              onValueChange={(value) => onValueChange(attribute.attributeId, value)}>
              <SelectTrigger className='h-12 rounded-lg w-full py-5 px-3 border border-secondary-2' dir='rtl'>
                <SelectValue placeholder='' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-50' dir='rtl' onCloseAutoFocus={(e) => e.preventDefault()}>
                {attribute.values.map((value) => (
                  <SelectItem key={value.valueId} value={String(value.valueId)}>
                    {value.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* COUNTER + STOCK — only when available */}
      {isAvailable && matchedVariant && (
        <div className='flex items-center justify-between'>
          <div className='flex gap-0.5 items-center text-sm'>
            <Icon IconComponent={TickSquare} className='text-primary-0' size={20} variant='Bold' toneTwoColor='--color-primary-0' />
            <span className='text-secondary-black-1'>موجود در انبار</span>
          </div>

          <QuantitySelector
            value={count}
            onChange={setCount}
            min={1}
            max={matchedVariant.stock > 0 ? matchedVariant.stock : undefined}
            size='sm'
          />
        </div>
      )}

      {/* PRICE — only when available */}
      {isAvailable && matchedVariant && (
        <div className='flex flex-row justify-end items-start gap-1 text-sm text-secondary-black-1'>
          {hasDiscount && (
            <>
              <span className='line-through text-secondary-2'>{separator(matchedVariant.compareAtPrice ?? 0)}</span>
              <span className='text-secondary-2'>|</span>
            </>
          )}
          <span>{separator(matchedVariant.price)}</span>
          <div className='text-secondary-2 flex flex-col items-end text-[0.7rem] leading-2'>
            <CurrencyLabel />
          </div>
        </div>
      )}

      {/* BUTTON — wired to the single cart hook */}
      {isCall ? (
        <a href={`tel:${callToAction}`}>
          <Button className={btnClass}>تماس بگیرید</Button>
        </a>
      ) : isAvailable ? (
        <Button className={btnClass} type='button' onClick={handleAddToCart} disabled={addToCartLoading}>
          {addToCartLoading ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
        </Button>
      ) : (
        <Button className={btnClass} type='button' disabled>
          {isComplete && !matchedVariant ? 'این ترکیب موجود نیست' : 'ناموجود'}
        </Button>
      )}

      {/* SUPPORT TEXT */}
      <div className='text-sm text-secondary-black-1'>سوالت رو اینجا بپرس!</div>

      {/* SOCIALS */}
      <div className='flex items-center justify-center flex-wrap gap-4'>
        <CallSocial communications={socialToAction} />
      </div>
    </div>
  );
};

export default AddToCart;
