'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Global, Logout, Notification, Profile } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';
import { useAuth } from '@/hooks/auth/useAuth';

export function AdminTopbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className='sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-gray-1 bg-white/90 px-4 backdrop-blur md:px-6'>
      <div className='flex flex-col'>
        <span className='text-sm font-semibold text-secondary-black-3'>داشبورد</span>
        <span className='text-caption text-secondary-2'>مدیریت فروشگاه</span>
      </div>

      <div className='ms-auto flex items-center gap-1.5'>
        <Button variant='ghost' size='icon' aria-label='اعلان‌ها' className='relative'>
          <Icon
            IconComponent={Notification}
            className='text-secondary-black-3'
            size={20}
            aria-hidden='true'
            variant='TwoTone'
            toneTwoColor='--color-primary-1'
          />
          <span className='absolute left-2 top-2 h-2 w-2 rounded-full bg-primary-1' />
        </Button>

        <Separator orientation='vertical' className='mx-1 h-6 bg-gray-2' />

        <Button variant='ghost' size='sm' asChild>
          <Link href='/'>
            <Icon
              IconComponent={Global}
              className='text-secondary-black-3'
              size={18}
              aria-hidden='true'
              variant='TwoTone'
              toneTwoColor='--color-primary-1'
            />
            مشاهده سایت
          </Link>
        </Button>

        <Button variant='outlinePrimary' size='sm' asChild>
          <Link href='/dashboard'>
            <Icon IconComponent={Profile} size={18} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-primary-1' />
            پنل شخصی
          </Link>
        </Button>

        <Button variant='ghost' size='sm' onClick={handleLogout} className='text-primary-1 hover:bg-primary-4'>
          <Icon IconComponent={Logout} size={18} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-primary-1' />
          خروج
        </Button>
      </div>
    </header>
  );
}
