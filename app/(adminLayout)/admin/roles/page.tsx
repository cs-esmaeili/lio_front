'use client';

import RolesManager from '@/components/admin/authorization/RolesManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminRolesPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.ROLE_READ]}>
      <RolesManager />
    </PermissionGate>
  );
}
