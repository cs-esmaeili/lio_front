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
      href="/compare"
      className="flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:bg-primary-3/80 transition-colors hover:rounded-full"
    >
      <Icon
        IconComponent={Check}
        className="text-secondary-black-3"
        size={24}
        aria-hidden="true"
        variant="TwoTone"
        toneTwoColor="--color-primary-1"
      />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
