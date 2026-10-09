'use client';

import { Pencil, ShieldCheck, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import { DEFAULT_ROLE_NAME } from '@/typescript/constants/roles';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

interface RoleRowProps {
  role: AdminRole;
  deleting?: boolean;
  onEdit: (role: AdminRole) => void;
  onDelete: (role: AdminRole) => void;
}

const MAX_CHIPS = 5;

export default function RoleRow({ role, deleting = false, onEdit, onDelete }: RoleRowProps) {
  const isDefault = role.name === DEFAULT_ROLE_NAME;
  const names = role.permissions.map((permission) => permission.name);
  const shown = names.slice(0, MAX_CHIPS);
  const rest = names.length - shown.length;

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-gray-1 bg-custom-white p-4', deleting && 'pointer-events-none opacity-60')}>
      <div className='flex items-start gap-3'>
        <div className='grid size-10 shrink-0 place-content-center rounded-lg bg-primary-4'>
          <ShieldCheck className='text-primary-1' size={18} aria-hidden='true' />
        </div>

        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <span className='truncate text-sm font-bold text-secondary-black-3' dir='auto'>
              {role.name}
            </span>
            {isDefault && <span className='shrink-0 rounded-md bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>پیش‌فرض</span>}
          </div>
          {role.description && <span className='truncate text-caption text-secondary-2'>{role.description}</span>}
        </div>

        {deleting ? (
          <Spinner className='text-primary-1' />
        ) : (
          <div className='flex shrink-0 items-center gap-1'>
            <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={() => onEdit(role)}>
              <Pencil />
            </Button>
            {!isDefault && (
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                title='حذف'
                onClick={() => onDelete(role)}>
                <Trash2 />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-1.5'>
        {names.length === 0 ? (
          <span className='text-caption text-secondary-3'>بدون دسترسی</span>
        ) : (
          <>
            {shown.map((name) => (
              <span key={name} className='rounded-md bg-gray-1 px-2 py-0.5 font-mono text-[11px] text-secondary-1' dir='ltr'>
                {name}
              </span>
            ))}
            {rest > 0 && <span className='text-caption text-secondary-3'>+ {rest.toLocaleString('fa-IR')} مورد دیگر</span>}
          </>
        )}
      </div>
    </div>
  );
}
