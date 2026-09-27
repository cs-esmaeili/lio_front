'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box1, Category, DocumentText, Folder2, Gallery, Home, Profile, RowHorizontal, RowVertical, Setting2, ShoppingCart, SliderHorizontal } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Separator } from '@/components/shadcn/separator';
import { useAuth } from '@/hooks/auth/useAuth';
import { PERMISSIONS } from '@/typescript/constants/permissions';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  /** Not implemented yet — rendered as a disabled placeholder. */
  soon?: boolean;
  /** Visible only when the user has at least one of these permissions. */
  anyOf?: string[];
  /** Visible only when the user has all of these permissions. */
  allOf?: string[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'عمومی',
    items: [{ href: '/admin', label: 'داشبورد', icon: Home }],
  },
  {
    title: 'مدیریت',
    items: [
      { href: '/admin/products', label: 'محصولات', icon: Box1, soon: true },
      {
        href: '/admin/categories',
        label: 'دسته‌بندی‌ها',
        icon: Category,
        anyOf: [PERMISSIONS.CATEGORY_READ, PERMISSIONS.CATEGORY_MANAGE],
      },
      { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart, soon: true },
      { href: '/admin/users', label: 'کاربران', icon: Profile, soon: true },
      { href: '/admin/files', label: 'فایل‌ها', icon: Folder2, allOf: [PERMISSIONS.FILE_READ] },
    ],
  },
  {
    title: 'سکشن‌ها',
    items: [
      { href: '/admin/sections/slider', label: 'اسلایدر', icon: SliderHorizontal, allOf: [PERMISSIONS.PAGE_MANAGE] },
      { href: '/admin/sections/banner', label: 'بنرها', icon: Gallery, allOf: [PERMISSIONS.PAGE_MANAGE] },
      { href: '/admin/sections/introduction', label: 'معرفی', icon: DocumentText, allOf: [PERMISSIONS.PAGE_MANAGE] },
      { href: '/admin/sections/header', label: 'هدر', icon: RowHorizontal, allOf: [PERMISSIONS.PAGE_MANAGE] },
      { href: '/admin/sections/footer', label: 'فوتر', icon: RowVertical, allOf: [PERMISSIONS.PAGE_MANAGE] },
    ],
  },
  {
    title: 'سیستم',
    items: [{ href: '/admin/settings', label: 'تنظیمات', icon: Setting2, allOf: [PERMISSIONS.SITE_MANAGE] }],
  },
];

/**
 * Admin panel sidebar. Items are filtered by the permissions loaded from
 * `/auth/me` (the auth store), so users only see what they can open.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const { user, hasAnyPermission, hasAllPermissions } = useAuth();

  const initials = (user?.name || user?.username || 'م').charAt(0);

  // Items are filtered by the permissions loaded from `/auth/me`; a section
  // with nothing left to show is dropped entirely.
  const sections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          (!item.anyOf?.length || hasAnyPermission(item.anyOf)) &&
          (!item.allOf?.length || hasAllPermissions(item.allOf)),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className='hidden md:flex w-72 shrink-0 flex-col h-screen sticky top-0 bg-custom-white border-l border-gray-1'>
      {/* Brand */}
      <div className='flex h-16 items-center gap-3 border-b border-gray-1 px-5'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary-4'>
          <Icon
            IconComponent={Setting2}
            className='text-primary-1'
            size={22}
            aria-hidden='true'
            variant='TwoTone'
            toneTwoColor='--color-primary-1'
          />
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-bold text-secondary-black-3'>پنل مدیریت</span>
          <span className='text-caption text-secondary-2'>Lio Admin</span>
        </div>
      </div>

      {/* Signed-in user */}
      <div className='flex items-center gap-3 px-5 py-4'>
        <Avatar size='lg'>
          <AvatarFallback className='bg-primary-3 font-bold text-primary-1'>{initials}</AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-col'>
          <span className='truncate text-sm font-medium text-secondary-black-3'>{user?.name || user?.username || 'کاربر مدیر'}</span>
          <span className='truncate text-caption text-secondary-2' dir='ltr'>
            {user?.username || '-'}
          </span>
        </div>
        <span className='ms-auto rounded-full bg-primary-4 px-2 py-0.5 text-[10px] font-medium text-primary-1'>مدیر</span>
      </div>

      <Separator className='bg-gray-1' />

      {/* Navigation */}
      <nav className='flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4'>
        {sections.map((section, index) => (
          <div key={section.title} className='flex flex-col gap-1'>
            {index > 0 && <Separator className='my-2 bg-gray-1' />}
            <span className='px-2 pb-1 text-caption font-medium text-secondary-3'>{section.title}</span>

            {section.items.map((item) =>
              item.soon ? (
                <div
                  key={item.href}
                  className='flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-secondary-3'>
                  <div className='flex items-center gap-2.5'>
                    <Icon
                      IconComponent={item.icon}
                      className='text-secondary-3'
                      size={20}
                      aria-hidden='true'
                      variant='TwoTone'
                      toneTwoColor='--color-secondary-3'
                    />
                    <span className='text-regular'>{item.label}</span>
                  </div>
                  <span className='rounded-full bg-gray-1 px-2 py-0.5 text-[10px] text-secondary-2'>به‌زودی</span>
                </div>
              ) : (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? 'bg-primary-4 text-primary-1'
                        : 'text-secondary-1 hover:bg-gray-1 hover:text-secondary-black-3'
                    }`}>
                    {(pathname === item.href || pathname.startsWith(`${item.href}/`)) && (
                      <span className='absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-1' />
                    )}
                    <Icon
                      IconComponent={item.icon}
                      className={pathname === item.href ? 'text-primary-1' : 'text-secondary-black-3'}
                      size={20}
                      aria-hidden='true'
                      variant='TwoTone'
                      toneTwoColor='--color-primary-1'
                    />
                    <span className='text-regular'>{item.label}</span>
                  </div>
                </Link>
              ),
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className='border-t border-gray-1 px-5 py-4'>
        <span className='text-caption text-secondary-3'>نسخه ۱.۰.۰</span>
      </div>
    </aside>
  );
}
