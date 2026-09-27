'use client';

import PermissionsManager from '@/components/admin/authorization/PermissionsManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminPermissionsPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PERMISSION_READ]}>
      <PermissionsManager />
    </PermissionGate>
  );
}
