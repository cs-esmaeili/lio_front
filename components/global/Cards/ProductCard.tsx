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

  return (
    <Link href={`/product/${slug}`} className='hover:text-primary-1'>
      <div
        className='p-3 h-full select-none group border-l'
        style={{
          borderImage: 'linear-gradient(to bottom, transparent, var(--primary-1), transparent) 1',
        }}>
        <div className='flex justify-center items-center shadow-[0_6px_10px_-8px_rgba(0,0,0,0.25)] mb-7 rounded-xl group-hover:shadow-none transition-all duration-500 ease-in-out'>
          <div
            className={`${styles.productCardImage} relative shrink-0 rounded-xl bg-white transition-all duration-500 ease-in-out w-full max-w-[200px] h-[250px]`}>
            <Image
              src={productImage}
              alt={`product-${id}`}
              onLoad={() => setLoaded(true)}
              className={`rounded-xl object-cover relative z-10 transition-transform duration-500 ease-in-out group-hover:-translate-y-2 mx-auto ${
                loaded ? fadeStyles.fadeIn : 'opacity-0'
              }`}
              fill
            />
          </div>
        </div>

        <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'} mb-5 line-clamp-2 h-12 text-[15px]!`}>{title}</div>

        {productStatus(default_variant) === 'available' && (
          <div className='flex flex-row-reverse justify-between items-center gap-1 sm:gap-2'>

            <div className="flex flex-col min-w-0 items-end w-full">
              <div className="flex items-start gap-1 w-full">
                <div
                  className={`${
                    onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'
                  } text-[14px] sm:text-[14px] md:text-[15px] w-full flex flex-flex-wrap`}
                >
                  {/* {isPriceRange
                    ? `${separator(minPrice)} - ${separator(maxPrice)}`
                    : separator(minPrice)} */}
                    {isPriceRange ? (
                      <div className="flex flex-row-reverse flex-wrap items-end gap-0 w-full text-left justify-start">
                        <div className='mr-4'>{separator(minPrice)}</div>
                        <div>{separator(maxPrice)}</div>
                      </div>
                    ) : (
                      <div className="flex flex-row flex-wrap items-end gap-0 w-full text-left justify-end">
                        {separator(minPrice)}
                      </div>
                    )}
                </div>

                <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-2'} text-[11px] sm:text-[11px] md:text-[12px]`}>
                  <CurrencyLabel />
                </div>
              </div>


              {!isPriceRange && roundedDiscount > 0 && (
                <div className='text-secondary-3 line-through text-[11px] sm:text-xs md:text-sm'>{separator(default_variant.amount)}</div>
              )}
            </div>


            {/* <div
                className="bg-primary-2 w-7 h-7 sm:w-8 md:w-9 sm:h-8 md:h-9 rounded-[9px]
                hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer
                flex justify-center items-center">
                <Icon IconComponent={Add} className="text-gray-1" size={18} />
              </div> */}

              {/* {!isPriceRange &&} */}
              { roundedDiscount > 0 && (
                <div className='flex gap-1 shrink-0'>
                  <div
                    className="bg-gray-3 text-secondary-black-3 w-7 h-7 sm:w-8 md:w-9 sm:h-8 md:h-9
                    text-[10px] sm:text-xs md:text-[14px] flex justify-center items-center rounded-[9px]
                    hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer"
                  >
                    {roundedDiscount}%
                  </div>
                </div>
              )}


          </div>
        )}

        {default_variant && productStatus(default_variant) === 'call' && (
          <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>تماس بگیرید</div>
        )}

        {default_variant && productStatus(default_variant) === 'notify' && (
          <div className={`${onBlackBackGround ? 'text-gray-1' : 'text-secondary-black-1'}`}>خبرم کن!</div>
        )}
      </div>
    </Link>
  );
}
