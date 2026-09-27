'use client';

import { KeyRound, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import type { AdminPermission } from '@/typescript/schemas/admin-authorization.schema';

interface PermissionRowProps {
  permission: AdminPermission;
  deleting?: boolean;
  onDelete: (permission: AdminPermission) => void;
}

export default function PermissionRow({ permission, deleting = false, onDelete }: PermissionRowProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5', deleting && 'pointer-events-none opacity-60')}>
      <div className='grid size-9 shrink-0 place-content-center rounded-lg bg-primary-4'>
        <KeyRound className='text-primary-1' size={16} aria-hidden='true' />
      </div>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate font-mono text-sm font-medium text-secondary-black-3' dir='ltr'>
          {permission.name}
        </span>
        {permission.description && <span className='truncate text-caption text-secondary-2'>{permission.description}</span>}
      </div>

      {deleting ? (
        <Spinner className='text-primary-1' />
      ) : (
        <div className='flex shrink-0 items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
            title='حذف'
            onClick={() => onDelete(permission)}>
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
