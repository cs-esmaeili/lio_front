'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/global/Icon';
import { ShoppingCart } from 'iconsax-reactjs';
import { useCart } from '@/hooks/cart/useCart';
import { usePathname } from 'next/navigation';

interface CartIconProps {
  onClick?: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const { distinctItemCount } = useCart();
  const cartLength = mounted ? distinctItemCount : 0;

  if (pathname === '/basket/' || pathname === '/checkout/') return null;

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label='سبد خرید'
      className='group relative flex size-6 cursor-pointer items-center justify-center'>
      <Icon IconComponent={ShoppingCart} className='text-primary-black-1 transition-colors group-hover:text-primary-1' size={24} aria-hidden='true' variant='Linear' />
      {cartLength > 0 && (
        <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-1 text-[10px] font-bold text-custom-white'>
          {cartLength}
        </span>
      )}
    </button>
  );
}
