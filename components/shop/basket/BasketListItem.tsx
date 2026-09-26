'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import noImage from '@/public/global/no-img.svg';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { QuantitySelector } from '@/components/shop/single/QuantitySelector';
import { Spinner } from '@/components/shadcn/spinner';

import type { BasketItem } from './basket.types';

interface BasketListItemProps {
  item: BasketItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export default function BasketListItem({ item, onQuantityChange, onRemove }: BasketListItemProps) {
  const id = String(item.variantId);
  const { variant, product } = item;
  const hasDiscount = variant.compareAtPrice != null && variant.compareAtPrice > variant.price;
  const currentPrice = variant.price;
  const originalPrice = variant.compareAtPrice;
  const subtotal = item.lineTotal;
  const maxQuantity = variant.stock > 0 ? variant.stock : 1;

  return (
    <tr className={`border-b border-gray-100 last:border-0 transition-opacity ${item.isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Product image */}
      <td className='py-4 ps-0 pe-2 align-middle text-center'>
        <Link href={`/product/${product.slug}`} className='inline-block relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden'>
          <Image src={product.image || noImage} alt={product.name} fill className='object-contain' sizes='96px' />
        </Link>
      </td>

      {/* Product name */}
      <td className='py-4 px-3 align-middle text-center min-w-40'>
        <Link href={`/product/${product.slug}`} className='font-medium text-regular text-gray-800 hover:text-primary-1 transition-colors no-underline'>
          {product.name}
        </Link>
      </td>

      {/* Unit price */}
      <td className='py-4 px-3 align-middle text-center'>
        <div className='flex flex-col items-center gap-0.5'>
          {hasDiscount && <span className='text-xs text-gray-400 line-through leading-none'>{(originalPrice ?? 0).toLocaleString()}</span>}
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <span className='text-secondary-black-1 text-regular font-medium'>{currentPrice.toLocaleString()}</span>
            <CurrencyLabel className='text-secondary-black-1' />
          </div>
        </div>
      </td>

      {/* Quantity selector */}
      <td className='py-4 px-3 align-middle text-center'>
        {item.isUpdating ? (
          <Spinner className='size-5 text-primary-1 inline-block' />
        ) : (
          <QuantitySelector
            value={item.quantity}
            onChange={(newQty) => onQuantityChange(id, newQty)}
            min={1}
            max={maxQuantity}
            size='sm'
            disabled={item.isUpdating}
            className='inline-flex'
          />
        )}
      </td>

      {/* Subtotal (جمع جز) */}
      <td className='py-4 px-3 align-middle text-center'>
        <div className='flex items-center justify-center gap-1 whitespace-nowrap'>
          <span className='text-secondary-black-1 text-regular font-bold'>{subtotal.toLocaleString()}</span>
          <CurrencyLabel className='text-secondary-black-1' />
        </div>
      </td>

      {/* Delete */}
      <td className='py-4 ps-3 pe-0 align-middle text-center'>
        <button onClick={() => onRemove(id)} className='text-gray-400 hover:text-red-500 transition p-1' aria-label='حذف' type='button'>
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
