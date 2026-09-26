'use client';

import Link from 'next/link';
import Image from 'next/image';
import tracking from '@/public/tracking.svg';
import { useAuth } from '@/hooks/auth/useAuth';
import Tracking from '@/styles/modules/tracking/TrackingSticky.module.css';

export default function TrackingSticky() {
  const { isHydrated, isLoggedIn } = useAuth();

  if (!isHydrated) {
    return (
      <span
        className={`hidden md:flex flex-col justify-center items-center fixed bottom-3 left-3 z-10 rounded-lg bg-secondary-black-3 pb-2 opacity-50
            ${Tracking.pulseZoom}`}>
        <Image className='block' src={tracking} alt='tracking' />
      </span>
    );
  }

  const href = isLoggedIn ? '/dashboard/tracking' : '/login';

  return (
    <Link
      href={href}
      prefetch={false}
      className={`hidden md:flex flex-col justify-center items-center fixed bottom-3 left-3 z-10 rounded-lg bg-secondary-black-3 pb-2 group
            ${Tracking.pulseZoom}`}>
      <Image className='block' src={tracking} alt='tracking' />

      <span
        className='w-16 text-sm font-medium text-center text-primary-3 
                transition-all duration-300 ease-in-out
                opacity-0 max-h-0 overflow-hidden
                group-hover:opacity-100 group-hover:max-h-10'>
        پیگیری سفارش
      </span>
    </Link>
  );
}
