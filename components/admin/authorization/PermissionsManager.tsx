'use client';

import { useMemo, useState } from 'react';
import { CircleAlert, KeyRound, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useDeletePermission } from '@/hooks/authorization/useDeletePermission';
import { usePermissionsList } from '@/hooks/authorization/usePermissionsList';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import PermissionRow from './PermissionRow';
import type { AdminPermission } from '@/typescript/schemas/admin-authorization.schema';

/** Manage permissions. */
export default function PermissionsManager() {
  const { permissions, loading, error, refetch } = usePermissionsList();
  const { deletePermission, loading: deleting } = useDeletePermission();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminPermission | null>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return permissions;
    return permissions.filter((permission) => permission.name.toLowerCase().includes(term) || (permission.description ?? '').toLowerCase().includes(term));
  }, [permissions, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = await deletePermission(deleteTarget.id);
    if (!removed) return;

    toast.success('دسترسی حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>دسترسی‌ها</h1>
          <p className='text-regular text-secondary-2'>کلیدهای دسترسی سیستم را مدیریت کنید.</p>
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

      {/* Search */}
      <div className='relative sm:max-w-80'>
        <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='جستجوی دسترسی...' className='h-10 ps-8' />
      </div>

      {/* List */}
      {loading && permissions.length === 0 ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-14 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && permissions.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <KeyRound className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>{search.trim() ? 'دسترسی‌ای با این جستجو پیدا نشد.' : 'هنوز دسترسی‌ای ثبت نشده است.'}</p>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {visible.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              deleting={deleting && deleteTarget?.id === permission.id}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.name ?? ''}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
