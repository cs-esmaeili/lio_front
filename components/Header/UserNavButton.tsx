'use client';

import Link from 'next/link';
import { User } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { useAuth } from '@/hooks/auth/useAuth';

export default function UserNavButton() {
  const { isHydrated, isLoggedIn } = useAuth();

  if (!isHydrated) {
    return (
      <span className='hidden md:flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative opacity-50'>
        <Icon IconComponent={User} className='text-primary-1' size={24} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-secondary-black-3' />
      </span>
    );
  }

  const href = isLoggedIn ? '/dashboard' : `/login`;

  return (
    <Link
      href={href}
      prefetch={false}
      className='hidden md:flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:bg-primary-3/80 transition-colors hover:rounded-full'>
      <Icon IconComponent={User} className='text-primary-1' size={24} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-secondary-black-3' />
    </Link>
  );
}
