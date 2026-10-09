'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/global/Icon';
import { Check } from 'iconsax-reactjs';
import { useCompareStore } from '@/stores/compareStore';
import Link from 'next/link';

export default function CompareIcon() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const data = useCompareStore((s) => s.data);
  const count = mounted ? (data?.products.length ?? 0) : 0;

  if (!mounted || count === 0) return null;

  return (
    <Link
      href='/compare'
      aria-label='مقایسه محصولات'
      className='group relative flex size-6 items-center justify-center transition-colors'>
      <Icon IconComponent={Check} className='text-primary-black-1 transition-colors group-hover:text-primary-1' size={24} aria-hidden='true' variant='Linear' />
      {count > 0 && (
        <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-1 text-[10px] font-bold text-custom-white'>
          {count}
        </span>
      )}
    </Link>
  );
}
