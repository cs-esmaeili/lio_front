'use client';

import UsersManager from '@/components/admin/user-manager/UsersManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminUsersPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.USER_READ]}>
      <UsersManager />
    </PermissionGate>
  );
}
