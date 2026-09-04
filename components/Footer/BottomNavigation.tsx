'use client';

import { useMemo } from 'react';
import Icon from '@/components/global/Icon';
import { Home, Category2, ShoppingBag, User } from 'iconsax-reactjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';
import { Spinner } from '@/components/shadcn/spinner';
import { separator } from '@/utils/number';
import { productStatus } from '@/utils/product/Product';
import { useCart } from '@/hooks/shop/useCart';
import { useCartStore } from '@/stores/cartStore';
import { useBasketUIStore } from '@/stores/basketUIStore';
import { useProductBottomNavStore } from '@/stores/productBottomNavStore';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { href: '/', label: 'خانه', IconComponent: Home },
  { href: '/categories', label: 'دسته بندی', IconComponent: Category2 },
];

function ProductBottomBar() {
  const { prices, product } = useProductBottomNavStore();

  const defaultPrice = useMemo(() => {
    if (!prices?.length || !product?.default_variant) return null;

    return prices.find((p: any) => p.id === product.default_variant.id) ?? null;
  }, [prices, product?.default_variant]);

  const defaultVariant = product?.default_variant;

  const status = useMemo(
    () => (defaultPrice ? productStatus(defaultPrice) : 'notify'),
    [defaultPrice],
  );

  const isAvailable = status === 'available';
  const isCall = status === 'call';
  const hasDiscount = defaultPrice && defaultPrice.discount_percent > 0;

  const { addToCart, addToCartLoading } = useCart();

  const cartItems = useCartStore((s) => s.items);
  const openBasket = useBasketUIStore((s) => s.open);

  const cartQuantity = defaultPrice
    ? (cartItems.find((i) => i.variant_id === defaultPrice.id)?.quantity ?? 0)
    : 0;

  const isInCart = cartQuantity > 0;

  const handleAddToCart = () => {
    if (!defaultPrice || !product?.id || !defaultVariant) return;

    const qty = defaultVariant.min_order ?? 1;

    addToCart(
      defaultPrice.id,
      product.id,
      qty,
      defaultVariant.max_order,
    );
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-20 px-4.25 py-5 bg-transparent md:hidden'>
      <div className='rounded-[50px] bg-primary-3/50 backdrop-blur-md py-3.75 px-4 h-18 flex flex-row justify-between items-center shadow-[0_0_25px_0_rgba(0,0,0,0.2)]'>
        {isAvailable && isInCart ? (
          <button
            type='button'
            className='text-body bg-secondary-black-3 text-gray-1 rounded-[50px] py-2 px-3 w-full text-center text-nowrap hover:bg-secondary-black-2 transition-colors cursor-pointer'
            onClick={openBasket}>
            مشاهده سبد خرید
          </button>
        ) : isAvailable ? (
          <button
            type='button'
            className='text-body bg-secondary-black-3 text-gray-1 rounded-[50px] py-2 px-3 w-full text-center text-nowrap hover:bg-secondary-black-2 transition-colors cursor-pointer'
            onClick={handleAddToCart}
            disabled={addToCartLoading}>
            {addToCartLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <Spinner className='size-4' />
                در حال افزودن...
              </span>
            ) : (
              'افزودن به سبد خرید'
            )}
          </button>
        ) : isCall ? (
          <button
            type='button'
            className='text-body bg-secondary-black-3 text-gray-1 rounded-[50px] py-2 px-3 w-full text-center text-nowrap hover:bg-secondary-black-2 transition-colors cursor-pointer'>
            تماس بگیرید
          </button>
        ) : (
          <button
            type='button'
            className='text-body bg-secondary-black-3 text-gray-1 rounded-[50px] py-2 px-3 w-full text-center text-nowrap hover:bg-secondary-black-2 transition-colors cursor-pointer'>
            خبرم کن
          </button>
        )}

        {defaultPrice && isAvailable && (
          <div className='text-body text-secondary-black-3 min-w-fit mx-5 text-nowrap cursor-pointer'>
            {hasDiscount && (
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <span className='bg-destructive text-white text-[0.6rem] rounded-full h-5 min-w-7 flex items-center justify-center relative -top-[0.05rem]'>
                  {defaultPrice.discount_percent}%
                </span>

                <span className='text-secondary-2 line-through'>
                  {separator(defaultPrice.amount)}
                </span>
              </div>
            )}

            <div className='flex items-center gap-1 whitespace-nowrap'>
              <span className='text-lg'>
                {separator(defaultPrice.final_amount)}
              </span>

              <div className='text-secondary-1 flex flex-col items-end text-[0.7rem] leading-2 relative -top-[0.05rem]'>
                <CurrencyLabel />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const BottomNavigation = ({
  supportPhone,
}: {
  supportPhone?: string;
}) => {
  const pathname = usePathname();

  const isProductPage = pathname?.startsWith('/product/');

  const productData = useProductBottomNavStore((s) => s.product);

  const cartItems = useCartStore((s) => s.items);
  const openBasket = useBasketUIStore((s) => s.open);

  // مهم: این Hook باید قبل از هر return شرطی اجرا شود
  const { isHydrated } = useAuth();

  const cartLength = cartItems.length;

  if (isProductPage && !productData) {
    return null;
  }

  return (
    <div className='fixed left-0 right-0 bottom-0 z-20 px-4.25 py-5 bg-transparent md:hidden'>
      <div className='rounded-[50px] bg-primary-3/50 backdrop-blur-md py-3.75 px-4 h-18 flex flex-row justify-between items-center shadow-[0_0_25px_0_rgba(0,0,0,0.2)]'>
        {NAV_ITEMS.map(({ href, label, IconComponent }) => {
          const isActive =
            href === '/'
              ? pathname === href
              : pathname?.startsWith(href);

          return (
            <Link href={href} key={href}>
              {isActive ? (
                <div className='flex flex-row items-center justify-center gap-1.5 py-2.5 px-5 rounded-[50px] bg-primary-2'>
                  <Icon
                    IconComponent={IconComponent}
                    size={24}
                    className='text-secondary-black-3 transition-colors duration-300'
                    variant='Bold'
                  />

                  <span className='text-[9px] xs:text-xs'>
                    {label}
                  </span>
                </div>
              ) : (
                <div className='flex flex-row items-center justify-center gap-1.5 py-2.5 px-5 rounded-[50px]'>
                  <Icon
                    IconComponent={IconComponent}
                    size={24}
                    className='text-secondary-black-3 transition-colors duration-300'
                    variant='Linear'
                  />
                </div>
              )}
            </Link>
          );
        })}

        <button
          type='button'
          onClick={openBasket}
          className='cursor-pointer'>
          <div className='flex flex-row items-center justify-center gap-1.5 py-2.5 px-5 rounded-[50px]'>
            <div className='relative'>
              <Icon
                IconComponent={ShoppingBag}
                size={24}
                className='text-secondary-black-3 transition-colors duration-300'
                variant='Linear'
              />

              {cartLength > 0 && (
                <span className='absolute -top-2 -right-2 bg-primary-1 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartLength}
                </span>
              )}
            </div>
          </div>
        </button>

        {isHydrated && (
          <Link href='/dashboard/'>
            <div className='flex flex-row items-center justify-center gap-1.5 py-2.5 px-5 rounded-[50px]'>
              <Icon
                IconComponent={User}
                size={24}
                className='text-secondary-black-3 transition-colors duration-300'
                variant='Linear'
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
