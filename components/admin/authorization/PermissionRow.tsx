'use client';

import { KeyRound } from 'lucide-react';

import type { AdminPermission } from '@/typescript/schemas/admin-authorization.schema';

interface PermissionRowProps {
  permission: AdminPermission;
}

export default function PermissionRow({ permission }: PermissionRowProps) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5'>
      <div className='grid size-9 shrink-0 place-content-center rounded-lg bg-primary-4'>
        <KeyRound className='text-primary-1' size={16} aria-hidden='true' />
      </div>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate font-mono text-sm font-medium text-secondary-black-3' dir='ltr'>
          {permission.name}
        </span>
        {permission.description && <span className='truncate text-caption text-secondary-2'>{permission.description}</span>}
      </div>
    </div>
  );
}
