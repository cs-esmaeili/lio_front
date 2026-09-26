'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import Icon from '../global/Icon';
import { Home, Edit2, Wallet, ShoppingCart, Like, Location, MessageText1, Logout, Archive, Profile, UserEdit, TruckTime, Setting2 } from 'iconsax-reactjs';
import PriceWithToman from '../global/PriceWithToman';
import { usePersonalInfo } from '@/hooks/dashboard/usePersonalInfo';

const navItems = [
  { href: '/dashboard/', label: 'داشبورد', icon: Archive },
  { href: '/dashboard/edit-profile/', label: 'ویرایش اطلاعات', icon: UserEdit },
  { href: '/dashboard/order/', label: 'سفارشات', icon: ShoppingCart },
  { href: '/dashboard/tracking/', label: 'پیگیری سفارش', icon: TruckTime },
  { href: '/dashboard/favorite/', label: 'علاقه‌مندی‌ها', icon: Like },
  { href: '/dashboard/address/', label: 'آدرس‌ها', icon: Location },
  { href: '/dashboard/ticket/', label: 'تیکت‌ها', icon: MessageText1 },
];

/** Only shown when the backend reports `showAdminPanel` for the user. */
const adminNavItem = { href: '/admin', label: 'داشبورد ادمین', icon: Setting2 };

const navMap = {
  dashboard: { href: '/dashboard/', label: 'داشبورد', icon: Home },
  userEdit: { href: '/dashboard/edit-profile/', label: 'کاربر', icon: Edit2 },
  wallet: { href: '/dashboard/wallet/', label: 'کیف پول', icon: Wallet },
  order: { href: '/dashboard/order/', label: 'سفارشات', icon: ShoppingCart },
  tracking: { href: '/dashboard/tracking/', label: 'پیگیری سفارش', icon: TruckTime },
  favorite: { href: '/dashboard/favorite/', label: 'علاقه‌مندی‌ها', icon: Like },
  address: { href: '/dashboard/address/', label: 'آدرس‌ها', icon: Location },
  ticket: { href: '/dashboard/ticket/', label: 'تیکت‌ها', icon: MessageText1 },
};

type SidebarVariant = 'light' | 'dark';

export function SidebarNavList({ onNavigate, variant = 'light' }: { onNavigate?: () => void; variant?: SidebarVariant }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, showAdminPanel } = useAuth();
  const isActive = (href: string) => pathname === href;
  const isDark = variant === 'dark';

  const items = showAdminPanel ? [...navItems, adminNavItem] : navItems;

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <>
      <nav>
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <div
                className={`
                  group flex flex-row items-center justify-between px-2 py-4
                  border-b transition-all duration-200 cursor-pointer
                  ${isDark ? 'border-black' : 'border-gray-1'}
                  ${active ? 'text-primary-1' : isDark ? 'text-white hover:text-primary-1' : 'text-secondary-1 hover:text-black'}
                `}>
                <div className='flex items-center justify-between gap-2'>
                  <div
                    className={`
                      flex items-center justify-between gap-2 p-1 rounded-lg
                      transition-colors duration-200
                      ${active ? 'bg-primary-3' : isDark ? 'group-hover:bg-white/10' : 'group-hover:bg-primary-3'}
                    `}>
                    <Icon
                      IconComponent={item.icon}
                      className={isDark ? 'text-white' : 'text-secondary-black-3'}
                      size={24}
                      aria-hidden='true'
                      variant='TwoTone'
                      toneTwoColor='--color-primary-1'
                    />
                  </div>
                  <span className='text-regular'>{item.label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          handleLogout();
          onNavigate?.();
        }}
        className={`
          group flex flex-row items-center justify-between px-2 py-5 border-b
          transition-all duration-200 cursor-pointer w-full
          ${isDark ? 'border-black text-white hover:text-primary-1' : 'border-gray-1 text-secondary-1 hover:text-black'}
        `}>
        <div className='flex items-center justify-between gap-2'>
          <div
            className={`
              flex items-center justify-between gap-2 p-1 rounded-lg transition-colors duration-200
              ${isDark ? 'group-hover:bg-white/10' : 'group-hover:bg-primary-3'}
            `}>
            <Icon
              IconComponent={Logout}
              className={isDark ? 'text-white' : 'text-secondary-black-3'}
              size={24}
              aria-hidden='true'
              variant='TwoTone'
              toneTwoColor='--color-primary-1'
            />
          </div>
          <span className='text-regular'>خروج</span>
        </div>
      </button>
    </>
  );
}

export function Sidebar() {
  const { personal, loading } = usePersonalInfo();

  return (
    <aside className='w-full md:w-80 bg-white h-fit md:sticky top-0'>
      <div className='flex flex-col p-4 rounded-xl border-gray-1 border-2 mb-1 md:mb-4'>
        <div className='flex items-center justify-between gap-2 border-b-2 border-gray-1 pb-4'>
          <div className='flex items-center justify-between gap-2'>
            {/* This Link is tempororaly*/}
            <Link key={navMap.dashboard.href} href={navMap.dashboard.href}>
              <div className='w-16 h-16 rounded-full bg-primary-3 flex items-center justify-center'>
                <Icon IconComponent={Profile} className='text-primary-1' size={36} aria-hidden='true' variant='TwoTone' />
              </div>
            </Link>
            <div>
              {!loading && (
                <>
                  <p className='text-regular text-secondary-1'>
                    {[personal?.user?.first_name, personal?.user?.last_name].filter(Boolean).join(' ') || 'کاربر'}
                  </p>
                  <p className='text-regular text-secondary-1'> {personal?.user?.mobile ?? '-'}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <Link
              href={navMap.userEdit.href}
              aria-label={navMap.userEdit.label}
              className='flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-primary-3'>
              <Icon
                IconComponent={navMap.userEdit.icon}
                className='text-secondary-black-3'
                size={18}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />
            </Link>
          </div>
        </div>

        {/* Wallet Card */}
        <div className='flex flex-row items-center justify-between p-2'>
          <div className='flex flex-col justify-between gap-2'>
            <div className='flex items-center justify-between gap-2'>
              <Icon
                IconComponent={navMap.wallet.icon}
                className='text-secondary-black-3 pb-1'
                size={28}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />
              <span className='text-regular text-secondary-1'>{navMap.wallet.label}</span>
            </div>
          </div>
          <div className='items-center'>
            <PriceWithToman price={personal?.wallets?.[0]?.balance ?? 0} />
          </div>
        </div>
      </div>

      <div className='hidden md:flex flex-col px-4 rounded-xl border-gray-1 border-2'>
        <SidebarNavList variant='light' />
      </div>
    </aside>
  );
}
