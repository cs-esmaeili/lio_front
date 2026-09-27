'use client';

import { KeyRound, Settings2 } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { getDisplayName, getInitial, USER_STATUS_CLASSES, USER_STATUS_LABELS } from './user-manager.model';
import type { AdminUser } from '@/typescript/schemas/admin-user.schema';

interface UserRowProps {
  user: AdminUser;
  onManage: (user: AdminUser) => void;
}

export default function UserRow({ user, onManage }: UserRowProps) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5'>
      <Avatar>
        <AvatarFallback className='bg-primary-3 font-bold text-primary-1'>{getInitial(user)}</AvatarFallback>
      </Avatar>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-sm font-medium text-secondary-black-3'>{getDisplayName(user)}</span>
        <span className='truncate text-caption text-secondary-3' dir='ltr'>
          {user.username}
        </span>
      </div>

      {user.role ? (
        <span className='hidden shrink-0 items-center gap-1 rounded-full bg-primary-4 px-2 py-0.5 text-[10px] font-medium text-primary-1 sm:inline-flex'>
          <KeyRound size={11} aria-hidden='true' />
          {user.role.name}
        </span>
      ) : (
        <span className='hidden shrink-0 rounded-full bg-gray-1 px-2 py-0.5 text-[10px] text-secondary-2 sm:inline'>بدون نقش</span>
      )}

      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', USER_STATUS_CLASSES[user.status])}>
        {USER_STATUS_LABELS[user.status]}
      </span>

      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        className='shrink-0 text-secondary-2 hover:text-primary-1'
        title='مدیریت کاربر'
        onClick={() => onManage(user)}>
        <Settings2 />
      </Button>
    </div>
  );
}
