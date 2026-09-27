'use client';

import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { toast } from 'sonner';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateRole } from '@/hooks/authorization/useCreateRole';
import { usePermissionsList } from '@/hooks/authorization/usePermissionsList';
import { useUpdateRole } from '@/hooks/authorization/useUpdateRole';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initial: AdminRole | null;
  onSaved: () => void;
}

export default function RoleFormModal({ open, onOpenChange, mode, initial, onSaved }: RoleFormModalProps) {
  const { createRole, loading: creating } = useCreateRole();
  const { updateRole, loading: updating } = useUpdateRole();
  const submitting = creating || updating;

  const { permissions, loading: loadingPermissions } = usePermissionsList();

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [selected, setSelected] = useState<Set<number>>(() => new Set(initial?.permissions.map((permission) => permission.id) ?? []));
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const visiblePermissions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return permissions;
    return permissions.filter((permission) => permission.name.toLowerCase().includes(term) || (permission.description ?? '').toLowerCase().includes(term));
  }, [permissions, search]);

  // --------------------------------------------------------

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('نام نقش الزامی است.');
      return;
    }

    const payload = { name: name.trim(), description: description.trim() || null, permissionIds: [...selected] };
    const saved = mode === 'edit' && initial ? await updateRole(initial.id, payload) : await createRole(payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'نقش ذخیره شد.' : 'نقش ایجاد شد.');
    onSaved();
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={submitting} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={submitting} onClick={() => void handleSubmit()}>
        {submitting && <Spinner />}
        {mode === 'edit' ? 'ذخیره تغییرات' : 'ایجاد نقش'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش نقش' : 'نقش جدید'} footer={footer} size='lg'>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>نام نقش</label>
            <Input dir='ltr' value={name} placeholder='editor' className='h-11 font-medium' onChange={(event) => setName(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>توضیحات (اختیاری)</label>
            <Input value={description ?? ''} placeholder='توضیح کوتاه' className='h-11' onChange={(event) => setDescription(event.target.value)} />
          </div>
        </div>

        {/* Permissions */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-secondary-black-3'>دسترسی‌ها</span>
            <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>{selected.size.toLocaleString('fa-IR')} انتخاب‌شده</span>
          </div>

          <div className='relative'>
            <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='جستجوی دسترسی...' className='h-10 ps-8' />
          </div>

          <div className='max-h-72 overflow-y-auto rounded-xl border border-gray-1'>
            {loadingPermissions ? (
              <div className='grid place-content-center py-12'>
                <Spinner className='size-6 text-primary-1' />
              </div>
            ) : visiblePermissions.length === 0 ? (
              <p className='py-10 text-center text-caption text-secondary-3'>دسترسی‌ای پیدا نشد.</p>
            ) : (
              <ul className='flex flex-col divide-y divide-gray-1'>
                {visiblePermissions.map((permission) => {
                  const isSelected = selected.has(permission.id);

                  return (
                    <li key={permission.id}>
                      <div
                        role='button'
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => toggle(permission.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggle(permission.id);
                          }
                        }}
                        className={cn('flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors', isSelected ? 'bg-primary-4/40' : 'hover:bg-gray-1')}>
                        <span
                          className={cn(
                            'grid size-5 shrink-0 place-content-center rounded-md border',
                            isSelected ? 'border-primary-1 bg-primary-1 text-custom-white' : 'border-gray-2 text-transparent',
                          )}>
                          <Check size={13} aria-hidden='true' />
                        </span>

                        <div className='flex min-w-0 flex-1 flex-col'>
                          <span className='truncate font-mono text-sm text-secondary-black-3' dir='ltr'>
                            {permission.name}
                          </span>
                          {permission.description && <span className='truncate text-caption text-secondary-2'>{permission.description}</span>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
