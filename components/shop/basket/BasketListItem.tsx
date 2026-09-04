'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { QuantitySelector } from '@/components/shop/single/QuantitySelector';
import { Spinner } from '@/components/shadcn/spinner';

import type { BasketItem } from './basket.types';

interface BasketListItemProps {
  item: BasketItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onMoveToNextPurchase: (id: string) => void;
}

export default function BasketListItem({ item, onQuantityChange, onRemove, onMoveToNextPurchase }: BasketListItemProps) {
  const id = String(item.product.product_price_id);
  const hasDiscount = item.base_discount > 0 ;
  const currentPrice = (item.base_amount -  item.base_discount);
  const originalPrice =  item.base_amount;
  const subtotal = item.final_amount;
  const attributes = item.product.attributes ?? [];

  return (
    <tr className={`border-b border-gray-100 last:border-0 transition-opacity ${item.isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Product image */}
      <td className='py-4 ps-0 pe-2 align-middle text-center'>
        <Link href={`/product/${item.product.slug}`} className='inline-block relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden'>
          <Image src={item.product.image} alt={item.product.title} fill className='object-cover' sizes='96px' />
        </Link>
      </td>

      {/* Product name + attributes */}
      <td className='py-4 px-3 align-middle text-center min-w-40'>
        <Link href={`/product/${item.product.slug}`} className='font-medium text-regular text-gray-800 hover:text-primary-1 transition-colors no-underline'>
          {item.product.title}
        </Link>
        {attributes.length > 0 && (
          <div className='flex flex-wrap justify-center gap-1 mt-1'>
            {attributes.map((attr, i) => (
              <span key={i} className='text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded'>
                {attr}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Unit price */}
      <td className='py-4 px-3 align-middle text-center'>
        <div className='flex flex-col items-center gap-0.5'>
          {hasDiscount && <span className='text-xs text-gray-400 line-through leading-none'>{originalPrice.toLocaleString()}</span>}
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
            min={item.product.min_order ?? 1}
            max={item.product.max_order}
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
