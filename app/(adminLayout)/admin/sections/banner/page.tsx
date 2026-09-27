'use client';

import BannerSectionsManager from '@/components/admin/sections/banner/BannerSectionsManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminBannerPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <BannerSectionsManager />
    </PermissionGate>
  );
}
