'use client';

import Link from 'next/link';
import { User } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { useAuth } from '@/hooks/auth/useAuth';

export default function UserNavButton() {
  const { isHydrated, isLoggedIn } = useAuth();

  if (!isHydrated) {
    return (
      <span className='flex size-6 items-center justify-center opacity-50'>
        <Icon IconComponent={User} className='text-primary-black-1' size={24} aria-hidden='true' variant='Linear' />
      </span>
    );
  }

  const href = isLoggedIn ? '/dashboard' : `/login`;

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label='حساب کاربری'
      className='group flex size-6 items-center justify-center transition-colors'>
      <Icon IconComponent={User} className='text-primary-black-1 transition-colors group-hover:text-primary-1' size={24} aria-hidden='true' variant='Linear' />
    </Link>
  );
}
