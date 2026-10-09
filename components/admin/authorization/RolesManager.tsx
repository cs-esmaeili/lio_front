'use client';

import { useMemo, useState } from 'react';
import { CircleAlert, Plus, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useDeleteRole } from '@/hooks/authorization/useDeleteRole';
import { useRolesList } from '@/hooks/authorization/useRolesList';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import RoleFormModal from './RoleFormModal';
import RoleRow from './RoleRow';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

/** Manage roles and their permissions. */
export default function RolesManager() {
  const { roles, loading, error, refetch } = useRolesList();
  const { deleteRole, loading: deleting } = useDeleteRole();

  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<{ mode: 'create' | 'edit'; role: AdminRole | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(term) || (role.description ?? '').toLowerCase().includes(term));
  }, [roles, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = await deleteRole(deleteTarget.id);
    if (!removed) return;

    toast.success('نقش حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>نقش‌ها</h1>
          <p className='text-regular text-secondary-2'>نقش‌ها را بسازید و دسترسی‌های هر نقش را تعیین کنید.</p>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='h-11 w-11 rounded-xl border-gray-2 text-secondary-2'
            title='بروزرسانی'
            disabled={loading}
            onClick={() => void refetch()}>
            {loading ? <Spinner /> : <RefreshCw />}
          </Button>

          <Button type='button' className='h-11 rounded-xl px-5' onClick={() => setEditor({ mode: 'create', role: null })}>
            <Plus />
            نقش جدید
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className='relative sm:max-w-80'>
        <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='جستجوی نقش...' className='h-10 ps-8' />
      </div>

      {/* List */}
      {loading && roles.length === 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-32 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && roles.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <ShieldCheck className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>{search.trim() ? 'نقشی با این جستجو پیدا نشد.' : 'هنوز نقشی ثبت نشده است.'}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {visible.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              deleting={deleting && deleteTarget?.id === role.id}
              onEdit={(value) => setEditor({ mode: 'edit', role: value })}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editor !== null && (
        <RoleFormModal
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          mode={editor.mode}
          initial={editor.role}
          onSaved={() => void refetch()}
        />
      )}

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.name ?? ''}
        warning={
          deleteTarget?.name === 'admin'
            ? 'هشدار: این نقش مدیریتی است و کاربرانش به نقش پیش‌فرض منتقل می‌شوند.'
            : 'کاربران این نقش به نقش پیش‌فرض منتقل می‌شوند.'
        }
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
