'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { Minus } from 'iconsax-reactjs';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  onAddToCart?: (id: number) => Promise<void> | void;
  onRemove?: (id: number) => Promise<boolean> | boolean | void;
  onBlackBackGround?: boolean;
  href?: string;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discountPercent,
  onAddToCart,
  onRemove,
  onBlackBackGround = false,
  href,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US').format(price);
  const formattedOriginalPrice = originalPrice && originalPrice > price ? new Intl.NumberFormat('en-US').format(originalPrice) : null;

  const finalDiscountPercent =
    discountPercent ?? (originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onAddToCart || isLoading) return;
    setIsLoading(true);
    try {
      await onAddToCart(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onRemove || isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove(id);
    } finally {
      setIsRemoving(false);
    }
  };

  const cardContent = (
    // Main container: flex row, no border, no shadow, no hover effects
    <div className={`flex flex-row gap-1 p-3 h-full select-none bg-white ${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>
      {/* Image - fixed 80px, no shadow, no hover animation */}
      <div className='flex relative shrink-0 w-20 h-20 rounded-xl bg-white overflow-hidden'>
        <Image src={image} alt={`product-${id}`} className='object-contain p-1' fill sizes='80px' />
      </div>

      {/* Right side: content column */}
      <div className='flex flex-col flex-grow p-1'>
        {/* Product name */}
        <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'} mb-2 line-clamp-2 text-regular`}>{name}</div>

        {/* Bottom row - exactly the same price/add structure as before */}
        <div className='flex flex-row justify-between items-center gap-2 mt-auto'>
          <div className='flex gap-1'>
            {onRemove && (
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className='bg-red-100 w-8 h-8 lg:w-8.5 lg:h-8.5 rounded-[9px] hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label={`Remove ${name} from favorites`}>
                {isRemoving ? (
                  <div className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin' />
                ) : (
                  <Icon IconComponent={Minus} className='text-red-500' size={20} />
                )}
              </button>
            )}

            {finalDiscountPercent && finalDiscountPercent > 0 && (
              <div className='bg-gray-3 text-secondary-black-3 w-8 h-8 lg:w-8.5 lg:h-8.5 text-xs flex justify-center items-center rounded-[9px] hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer'>
                {finalDiscountPercent}%
              </div>
            )}
          </div>

          <div className='flex flex-col items-end'>
            <div className='flex flex-row justify-center items-start gap-1'>
              <span className={onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}>{formattedPrice}</span>
              <span className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-2'} flex flex-col items-end text-[0.7rem] leading-2`}>
                <CurrencyLabel />
              </span>
            </div>
            {formattedOriginalPrice && (
              <div className='flex flex-row justify-center items-start gap-1'>
                <span className={`${onBlackBackGround ? 'text-secondary-3' : 'text-secondary-3'} line-through text-sm`}>
                  {formattedOriginalPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
}
