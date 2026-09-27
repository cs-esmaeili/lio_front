'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useAssignUserRole } from '@/hooks/users/useAssignUserRole';
import { useUpdateUserStatus } from '@/hooks/users/useUpdateUserStatus';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import { getDisplayName, USER_STATUS_LABELS } from './user-manager.model';
import type { AdminRole, AdminUser, UserStatus } from '@/typescript/schemas/admin-user.schema';

interface UserManageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  roles: AdminRole[];
  onSaved: () => void;
}

const NO_ROLE = 'none';

export default function UserManageModal({ open, onOpenChange, user, roles, onSaved }: UserManageModalProps) {
  const { hasPermission } = usePermissions();
  const canManageStatus = hasPermission(PERMISSIONS.USER_MANAGE);
  const canAssignRole = hasPermission(PERMISSIONS.USER_ROLE_MANAGE);

  const { updateStatus, loading: savingStatus } = useUpdateUserStatus();
  const { assignRole, loading: savingRole } = useAssignUserRole();
  const submitting = savingStatus || savingRole;

  const initialRoleId = user.role?.id ?? null;
  const [roleId, setRoleId] = useState<number | null>(initialRoleId);
  const [status, setStatus] = useState<UserStatus>(user.status);

  // --------------------------------------------------------

  const handleSubmit = async () => {
    let changed = false;

    if (canManageStatus && status !== user.status) {
      const updated = await updateStatus(user.id, status);
      if (!updated) return;
      changed = true;
    }

    if (canAssignRole && roleId !== initialRoleId) {
      const ok = await assignRole(user.id, roleId);
      if (!ok) return;
      changed = true;
    }

    if (!changed) {
      onOpenChange(false);
      return;
    }

    toast.success('تغییرات ذخیره شد.');
    onSaved();
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={submitting} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={submitting || (!canManageStatus && !canAssignRole)} onClick={() => void handleSubmit()}>
        {submitting && <Spinner />}
        ذخیره تغییرات
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title='مدیریت کاربر' footer={footer} size='md'>
      <div className='flex flex-col gap-6'>
        {/* Read-only info */}
        <div className='flex flex-col gap-2 rounded-xl border border-gray-1 bg-gray-1/40 p-4'>
          <span className='text-sm font-bold text-secondary-black-3'>{getDisplayName(user)}</span>
          <div className='grid grid-cols-1 gap-1.5 text-caption text-secondary-2 sm:grid-cols-2'>
            <span dir='ltr'>نام کاربری: {user.username}</span>
            <span>نام: {user.name || '—'}</span>
            <span>نام خانوادگی: {user.lastName || '—'}</span>
            <span dir='ltr'>کد ملی: {user.nationalCode || '—'}</span>
          </div>
        </div>

        {/* Role */}
        <div className='flex flex-col gap-2'>
          <Label className='text-sm text-secondary-1'>نقش</Label>
          <Select value={roleId === null ? NO_ROLE : String(roleId)} onValueChange={(value) => setRoleId(value === NO_ROLE ? null : Number(value))} disabled={!canAssignRole || submitting}>
            <SelectTrigger className='!h-11 w-full' dir='rtl'>
              <SelectValue placeholder='انتخاب نقش' />
            </SelectTrigger>
            <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
              <SelectItem value={NO_ROLE}>بدون نقش</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!canAssignRole && <p className='text-caption text-secondary-3'>برای تغییر نقش، پرمیشن لازم را ندارید.</p>}
        </div>

        {/* Status */}
        <div className='flex flex-col gap-2'>
          <Label className='text-sm text-secondary-1'>وضعیت</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)} disabled={!canManageStatus || submitting}>
            <SelectTrigger className='!h-11 w-full' dir='rtl'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper' dir='rtl' className='z-50'>
              {(Object.keys(USER_STATUS_LABELS) as UserStatus[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {USER_STATUS_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!canManageStatus && <p className='text-caption text-secondary-3'>برای تغییر وضعیت، پرمیشن لازم را ندارید.</p>}
        </div>
      </div>
    </ReusableModal>
  );
}
