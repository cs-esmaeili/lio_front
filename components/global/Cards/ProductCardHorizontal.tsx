'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { Add } from 'iconsax-reactjs';
import styles from '@/styles/modules/Product.module.css';
import fadeStyles from '@/styles/modules/imageFade.module.css';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { productStatus } from '@/utils/product/Product';
import { separator } from '@/utils/number';

type ProductCardHorizontalProps = {
  data: any;
  onBlackBackGround?: boolean;
};

export default function ProductCardHorizontal({ data, onBlackBackGround = false }: ProductCardHorizontalProps) {
  const [loaded, setLoaded] = useState(false);

  const { id, image, title, slug, default_variant, variants = [] } = data;

  const roundedDiscount = Math.round(default_variant?.discount_percent || 0);

  // فقط وریانت‌های موجود
  const availableVariants = variants.filter((v: any) => v.is_available);

  // قیمت‌های نهایی (بعد از تخفیف)
  const finalPrices = availableVariants.map((v: any) => v.final_amount);

  const minPrice = finalPrices.length ? Math.min(...finalPrices) : default_variant.final_amount;

  const maxPrice = finalPrices.length ? Math.max(...finalPrices) : default_variant.final_amount;

  const isPriceRange = minPrice !== maxPrice;

  return (
    <Link href={`/product/${slug}`} className='hover:text-primary-1'>
      <div
        className='p-3 select-none group border-b z-10 w-full!'
        style={{
          borderImage: 'linear-gradient(to right, transparent, var(--primary-1), transparent) 1',
        }}>
        <div className='flex flex-row items-center gap-4'>
          {/* Image - Right */}
          <div className='shadow-[0_6px_10px_-8px_rgba(0,0,0,0.25)] group-hover:shadow-none transition-all duration-500 ease-in-out rounded-xl shrink-0'>
            <div className={`${styles.productCardImage} relative rounded-xl p-4 bg-white transition-all duration-500 ease-in-out`}>
              <Image
                src={image}
                alt={`product-${id}`}
                onLoad={() => setLoaded(true)}
                className={`object-contain relative z-10 transition-transform duration-500 ease-in-out group-hover:-translate-y-1 mx-auto ${
                  loaded ? fadeStyles.fadeIn : 'opacity-0'
                }`}
                width={80}
                height={110}
              />
            </div>
          </div>

          {/* Content - Left */}
          <div className='flex flex-col flex-1 gap-3'>
            <h5 className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'} line-clamp-2`}>{title}</h5>

            {productStatus(default_variant) === 'available' && (
              <div className='flex flex-row justify-between items-center'>
                <div className='flex gap-1'>
                  {roundedDiscount > 0 && (
                    <div
                      className='bg-gray-3 text-secondary-black-3 w-8 h-8 lg:w-8.5 lg:h-8.5 text-xs
                        flex justify-center items-center rounded-[9px] hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer'>
                      {roundedDiscount}%
                    </div>
                  )}
                </div>

                <div className='flex flex-col items-end'>
                  <div className='flex flex-row justify-center items-start gap-1'>
                    <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>
                      {isPriceRange
                        ? `${separator(minPrice)} - ${separator(maxPrice)}`
                        : separator(minPrice)}
                    </div>
                    <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-2'} flex flex-col items-end text-[0.7rem] leading-2`}>
                      <CurrencyLabel />
                    </div>
                  </div>

                  {!isPriceRange && roundedDiscount > 0 && (
                    <div className='text-secondary-3 line-through text-sm'>{separator(default_variant.amount)}</div>
                  )}
                </div>
              </div>
            )}

            {productStatus(default_variant) === 'call' && (
              <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>تماس بگیرید</div>
            )}

            {productStatus(default_variant) === 'notify' && (
              <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>خبرم کن!</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
