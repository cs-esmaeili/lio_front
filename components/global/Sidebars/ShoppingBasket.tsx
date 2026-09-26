'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { ShoppingCart } from 'iconsax-reactjs';
import Image from 'next/image';
import noImage from '@/public/global/no-img.svg';
import CurrencyLabel from '../Cards/CurrencyLabel';
import { QuantitySelector } from '@/components/shop/single/QuantitySelector';
import { StrokePrimaryButton } from '../Buttons/StrokePrimaryButton';
import { useCart } from '@/hooks/cart/useCart';
import { separator } from '@/utils/number';
import { Spinner } from '@/components/shadcn/spinner';

interface ShoppingBasketProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingBasket({ isOpen, onClose }: ShoppingBasketProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { loading, isEmpty, items, subtotal, updatingVariants, updateQuantity, removeItem, refetch } = useCart();

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-30 bg-gray-1/20 backdrop-blur-md' onClick={handleBackdropClick} />

      {/* Basket drawer panel */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 bottom-0 left-5 w-90
          bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-2xl z-51
          transform transition-transform duration-300 ease-out
          flex flex-col
        `}
        style={{ height: 'calc(100vh - 40px)', margin: '20px 0' }}>
        {/* Header */}
        <div className='flex w-full items-center justify-between p-4 border-b border-gray-100'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9'>
              <Icon
                IconComponent={ShoppingCart}
                className='text-secondary-black-3'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />
            </div>
            <span className='text-regular font-semibold text-gray-800'>سبد خرید</span>
          </div>
          <button onClick={onClose} className='p-1 bg-gray-2 hover:bg-gray-3 rounded-full transition' aria-label='بستن'>
            <X className='text-white' size={20} />
          </button>
        </div>

        {/* Basket items – scrollable */}
        <div className='flex-1 overflow-y-auto p-4 space-y-5'>
          {loading ? (
            <div className='flex items-center justify-center py-10'>
              <Spinner className='size-8' />
            </div>
          ) : isEmpty ? (
            <div className='text-center text-gray-500 py-10'>سبد خرید شما خالی است</div>
          ) : (
            items.map((item) => {
              const variantId = item.variantId;
              const hasDiscount = item.variant.compareAtPrice != null && item.variant.compareAtPrice > item.variant.price;
              const isUpdating = updatingVariants.has(variantId);
              const maxQuantity = item.variant.stock > 0 ? item.variant.stock : 1;

              return (
                <div key={variantId} className='w-full border-b border-gray-100 pb-1 last:border-0 relative'>
                  {/* Per-item loading overlay */}
                  {isUpdating && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-lg'>
                      <Spinner className='size-6 text-primary-1' />
                    </div>
                  )}

                  {/* Row 1: Image, name, delete button */}
                  <div className='flex gap-4'>
                    <Link href={`/product/${item.product.slug}`} onClick={onClose} className='relative w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden block'>
                      <Image src={item.product.image || noImage} alt={item.product.name} fill className='object-contain' sizes='96px' />
                    </Link>
                    <div className='flex-1 flex justify-between items-center'>
                      <Link href={`/product/${item.product.slug}`} onClick={onClose} className='font-medium text-regular text-gray-800 hover:text-primary-1 transition-colors no-underline'>
                        {item.product.name}
                      </Link>
                      <button onClick={() => removeItem(variantId)} className='text-gray-400 hover:text-red-500 transition' aria-label='حذف'>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Quantity controls */}
                  <div className='flex justify-between items-center mt-3'>
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(newQty) => updateQuantity(variantId, newQty)}
                      min={1}
                      max={maxQuantity}
                      size='sm'
                      disabled={isUpdating}
                    />
                  </div>

                  {/* Row 3: Price display with optional strikethrough */}
                  <div className='text-left mt-4'>
                    <div className='flex flex-row gap-4 items-end justify-end'>
                      {hasDiscount && <div className='text-secondary-3 line-through'>{separator(item.variant.compareAtPrice ?? 0)}</div>}
                      <div className='flex flex-row justify-end items-start gap-1'>
                        <div className='text-secondary-black-1'>{separator(item.lineTotal)}</div>
                        <CurrencyLabel />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with total and buttons */}
        {!loading && !isEmpty && (
          <div className='border-t border-gray-100 pt-4 px-4 pb-5 space-y-3'>
            <div className='flex justify-between items-center border-t border-gray-100 pt-2'>
              <span className='text-regular text-gray-600'>قیمت کل</span>
              <div className='flex items-center gap-1'>
                <span className='text-regular text-secondary-black-1 font-bold'>{separator(subtotal)}</span>
                <CurrencyLabel />
              </div>
            </div>

            <div className='flex gap-4 pt-2 justify-center'>
              <StrokePrimaryButton href='/basket' desktopText='مشاهده سبد خرید' mobileText='سبد خرید' className='w-full flex-1.5' onClick={() => onClose()} />
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
