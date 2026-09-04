'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import Icon from './Icon';
import { ArrowLeft } from 'iconsax-reactjs';

export default function LottieAnimation({ src }: { src: string }) {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [src]);

  if (!animationData) return null;

  return (
    <div className='flex flex-col items-center justify-center p-20 gap-8'>
      <Lottie animationData={animationData} loop className='w-80 h-80' />
      <div className='flex gap-4'>
        <button className='p-4! text-base! bg-primary-1 rounded-[8px] text-gray-1 cursor-pointer' onClick={() => router.push('/')}>
          <span>صفحه اصلی</span>
        </button>
        <button className='bg-primary-4 text-primary-1 p-4! rounded-[8px] flex gap-0.75 cursor-pointer' onClick={() => router.back()}>
          <span>بازگشت به صفحه قبل</span>
          <Icon
            IconComponent={ArrowLeft}
            size={24}
            variant='TwoTone'
            toneTwoColor='--color-primary-1'
            className='text-secondary-black-1  hidden md:block '
          />
        </button>
      </div>
    </div>
  );
}
