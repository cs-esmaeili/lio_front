'use client';

import ContactManager from '@/components/admin/sections/contact/ContactManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminContactPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <ContactManager />
    </PermissionGate>
  );
}
