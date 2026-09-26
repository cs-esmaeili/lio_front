'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import noImage from '@/public/global/no-img.svg';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import styles from '@/styles/modules/Product.module.css';
import fadeStyles from '@/styles/modules/imageFade.module.css';

import type { BasketItem } from '@/components/shop/basket/basket.types';

interface CheckoutCardProps {
  data: BasketItem;
  onBlackBackGround?: boolean;
}

export default function CheckoutCard({
  data,
  onBlackBackGround = false,
}: CheckoutCardProps) {
  const [loaded, setLoaded] = useState(false);

  const hasDiscount =
    data.variant.compareAtPrice != null && data.variant.compareAtPrice > data.variant.price;

  return (
    <div
      className="group h-full select-none border-l p-3"
      style={{
        borderImage:
          'linear-gradient(to bottom, transparent, var(--primary-1), transparent) 1',
      }}
    >
      <Link href={`/product/${data.product.slug}`} className="block no-underline">
        <div className="mb-7 flex items-center justify-center rounded-xl shadow-[0_6px_10px_-8px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:shadow-none">
          <div
            className={`${styles.productCardImage} relative h-[250px] w-full max-w-[200px] rounded-xl bg-white`}
          >
            <Image
              src={data.product.image || noImage}
              alt={data.product.name}
              fill
              onLoad={() => setLoaded(true)}
              className={`relative z-10 rounded-xl object-contain transition-all duration-500 group-hover:-translate-y-2 ${
                loaded ? fadeStyles.fadeIn : 'opacity-0'
              }`}
            />
          </div>
        </div>

        <h5
          className={`mb-3 line-clamp-2 h-12 text-[15px] hover:text-primary-1 transition-colors ${
            onBlackBackGround
              ? 'text-gray-1'
              : 'text-secondary-black-1'
          }`}
        >
          {data.product.name}
        </h5>
      </Link>
      

      <div className="mb-4 text-sm text-secondary-2">
        تعداد:
        <span className="mr-1 text-secondary-black-1">
          {data.quantity}
        </span>
      </div>

      <div className="flex items-end justify-between">
        {hasDiscount ? (
          <div className="text-sm text-secondary-3 line-through">
            {(data.variant.compareAtPrice ?? 0).toLocaleString()}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-start gap-1 whitespace-nowrap">
          <span
            className={
              onBlackBackGround
                ? 'text-gray-1'
                : 'text-secondary-black-1'
            }
          >
            {data.variant.price.toLocaleString()}
          </span>

          <div
            className={
              onBlackBackGround
                ? 'text-gray-1'
                : 'text-secondary-2'
            }
          >
            <CurrencyLabel />
          </div>
        </div>
      </div>
    </div>
  );
}
