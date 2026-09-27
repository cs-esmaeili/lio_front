'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CircleAlert, RefreshCw, Search, Users } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { useRoleOptions } from '@/hooks/users/useRoleOptions';
import { useUsersList } from '@/hooks/users/useUsersList';
import UserManageModal from './UserManageModal';
import UserRow from './UserRow';
import { USER_STATUS_LABELS } from './user-manager.model';
import type { AdminUser, UserStatus } from '@/typescript/schemas/admin-user.schema';

const PAGE_SIZE = 20;
const ALL = 'ALL';

/** Admin users list with search, filters and per-user management. */
export default function UsersManager() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<UserStatus | typeof ALL>(ALL);
  const [roleId, setRoleId] = useState<number | typeof ALL>(ALL);
  const [manageTarget, setManageTarget] = useState<AdminUser | null>(null);

  const { roles } = useRoleOptions();

  const { data, loading, error, refetch } = useUsersList({
    page,
    limit: PAGE_SIZE,
    search,
    status: status === ALL ? undefined : status,
    roleId: roleId === ALL ? undefined : roleId,
  });

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const canPrev = page > 1;
  const canNext = page < (data.totalPages ?? 1);

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>کاربران</h1>
          <p className='text-regular text-secondary-2'>کاربران را جستجو، مرور و نقش یا وضعیتشان را مدیریت کنید.</p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-11 w-11 shrink-0 rounded-xl border-gray-2 text-secondary-2'
          title='بروزرسانی'
          disabled={loading}
          onClick={() => void refetch()}>
          {loading ? <Spinner /> : <RefreshCw />}
        </Button>
      </div>

      {/* Toolbar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative min-w-0 flex-1 sm:max-w-80'>
          <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
          <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder='جستجوی نام کاربری، نام یا کد ملی...' className='h-10 ps-8' />
        </div>

        <Select value={status} onValueChange={(value) => { setStatus(value as UserStatus | typeof ALL); setPage(1); }}>
          <SelectTrigger className='!h-10 w-full sm:w-44' dir='rtl'>
            <SelectValue placeholder='وضعیت' />
          </SelectTrigger>
          <SelectContent position='popper' dir='rtl' className='z-50'>
            <SelectItem value={ALL}>همه وضعیت‌ها</SelectItem>
            {(Object.keys(USER_STATUS_LABELS) as UserStatus[]).map((key) => (
              <SelectItem key={key} value={key}>
                {USER_STATUS_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleId === ALL ? ALL : String(roleId)} onValueChange={(value) => { setRoleId(value === ALL ? ALL : Number(value)); setPage(1); }}>
          <SelectTrigger className='!h-10 w-full sm:w-44' dir='rtl'>
            <SelectValue placeholder='نقش' />
          </SelectTrigger>
          <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
            <SelectItem value={ALL}>همه نقش‌ها</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading && data.items.length === 0 ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-16 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && data.items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : data.items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <Users className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>کاربری با این مشخصات پیدا نشد.</p>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-2'>
            {data.items.map((user) => (
              <UserRow key={user.id} user={user} onManage={setManageTarget} />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between'>
            <Button type='button' variant='outline' size='sm' className='h-9 rounded-lg border-gray-2' disabled={!canPrev || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronRight />
              قبلی
            </Button>
            <span className='text-caption text-secondary-2'>
              صفحه {data.page.toLocaleString('fa-IR')} از {data.totalPages.toLocaleString('fa-IR')} — {data.total.toLocaleString('fa-IR')} کاربر
            </span>
            <Button type='button' variant='outline' size='sm' className='h-9 rounded-lg border-gray-2' disabled={!canNext || loading} onClick={() => setPage((p) => p + 1)}>
              بعدی
              <ChevronLeft />
            </Button>
          </div>
        </>
      )}

      {manageTarget !== null && (
        <UserManageModal
          open
          onOpenChange={(open) => {
            if (!open) setManageTarget(null);
          }}
          user={manageTarget}
          roles={roles}
          onSaved={() => void refetch()}
        />
      )}

    </div>
  );
}
