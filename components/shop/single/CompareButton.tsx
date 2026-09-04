'use client';

import { useState, useEffect } from 'react';
import { Check } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { useCompare } from '@/hooks/useCompare';

type Props = {
  productId: string;
  productCategory: string;
};

export default function CompareButton({ productId, productCategory }: Props) {
  const { isCompared, toggle } = useCompare(productId, productCategory);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCompared = mounted ? isCompared : false;

  return (
    <button onClick={mounted ? toggle : undefined} className='cursor-pointer'>
      <Icon
        IconComponent={Check}
        size={24}
        variant={displayCompared ? 'Bold' : 'Linear'}
        className={displayCompared ? 'text-primary-1' : 'text-primary-1'}
      />
    </button>
  );
}
