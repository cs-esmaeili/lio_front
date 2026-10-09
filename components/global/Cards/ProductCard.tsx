'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import fadeStyles from '@/styles/modules/imageFade.module.css';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { productStatus } from '@/utils/product/Product';
import { separator } from '@/utils/number';
import productPlaceholder from '@/public/global/no-img.svg';

type ProductCardProps = {
  data: any;
  onBlackBackGround?: boolean;
  showBorder?: boolean;
};

export default function ProductCard({ data, onBlackBackGround = false }: ProductCardProps) {
  const [loaded, setLoaded] = useState(false);

  const { id, productName, productSlug, images, default_variant, variants = [] } = data;
  const title = productName ?? data.title;
  const slug = productSlug ?? data.slug;
  const image = images?.find((img: any) => img.isPrimary)?.url ?? images?.[0]?.url ?? data.image;
  const productImage = image?.trim() ? image : productPlaceholder;

  const roundedDiscount = Math.round(default_variant?.discount_percent || 0);

  // فقط وریانت‌های موجود
  const availableVariants = variants.filter((v: any) => v.is_available);

  // قیمت‌های نهایی (بعد از تخفیف)
  const finalPrices = availableVariants.map((v: any) => v.final_amount);

  const minPrice = finalPrices.length ? Math.min(...finalPrices) : default_variant?.final_amount;

  const maxPrice = finalPrices.length ? Math.max(...finalPrices) : default_variant?.final_amount;

  const isPriceRange = minPrice !== maxPrice;

  const titleColor = onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-3';
  const priceColor = onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-3';

  return (
    <Link href={`/product/${slug}`} className='group block h-full'>
      <div className={`flex h-full flex-col p-3 ${titleColor}`}>
        <div
          className={`relative mx-auto h-[250px] w-full max-w-[200px] overflow-hidden rounded-2xl transition-colors duration-300 ${
            onBlackBackGround ? 'bg-secondary-black-1' : 'bg-gray-1 group-hover:bg-primary-4/70'
          }`}>
          <Image
            src={productImage}
            alt={`product-${id}`}
            onLoad={() => setLoaded(true)}
            className={`object-contain p-3 transition-transform duration-500 ease-in-out group-hover:scale-105 ${
              loaded ? fadeStyles.fadeIn : 'opacity-0'
            }`}
            fill
          />

          {roundedDiscount > 0 && (
            <span className='absolute right-2 top-2 z-10 flex h-7 min-w-7 items-center justify-center rounded-lg bg-primary-1 px-1.5 text-[11px] font-bold text-custom-white'>
              {roundedDiscount}%
            </span>
          )}
        </div>

        <div className={`mb-4 mt-4 line-clamp-2 h-12 text-[15px] leading-6 ${titleColor}`}>{title}</div>

        {productStatus(default_variant) === 'available' && (
          <div className='mt-auto flex items-end justify-between gap-2'>
            <div className={`flex items-end gap-1 ${priceColor}`}>
              <span className='text-[15px] font-bold'>
                {isPriceRange ? `${separator(minPrice)} - ${separator(maxPrice)}` : separator(minPrice)}
              </span>
              <span className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-2'} text-[11px]`}>
                <CurrencyLabel />
              </span>
            </div>

            {!isPriceRange && roundedDiscount > 0 && (
              <span className='text-[11px] text-secondary-3 line-through'>{separator(default_variant.amount)}</span>
            )}
          </div>
        )}

        {default_variant && productStatus(default_variant) === 'call' && (
          <div className={`mt-auto ${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>تماس بگیرید</div>
        )}

        {default_variant && productStatus(default_variant) === 'notify' && (
          <div className={`mt-auto ${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>خبرم کن!</div>
        )}
      </div>
    </Link>
  );
}
