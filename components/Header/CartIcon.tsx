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
    <div
      className='hidden md:flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:rounded-full'
      onClick={onClick}
    >
      <Icon
        IconComponent={ShoppingCart}
        className='text-secondary-black-3'
        size={24}
        aria-hidden='true'
        variant='TwoTone'
        toneTwoColor='--color-primary-1'
      />
      {cartLength > 0 && (
        <span className='absolute -top-2 -right-2 bg-primary-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
          {cartLength}
        </span>
      )}
    </div>
  );
}
