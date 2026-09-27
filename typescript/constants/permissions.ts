/**
 * Permission strings granted by the backend (`GET /auth/me`) and checked in the
 * UI through `usePermissions` / `useAuth`. Keep in sync with the backend seed
 * (`lio_back/src/database/seed/permissions.ts`).
 */
export const PERMISSIONS = {
  /** Open the admin dashboard panel. */
  ADMIN_PANEL_VIEW: 'admin:panel:view',
  /** Browse and select files and folders (required to open the file manager). */
  FILE_READ: 'file:read',
  /** Upload files. */
  FILE_UPLOAD: 'file:upload',
  /** Create folders. */
  FILE_CREATE: 'file:create',
  /** Delete files and folders. */
  FILE_DELETE: 'file:delete',
  /** Create, update and delete site settings. */
  SITE_MANAGE: 'site:manage',
  /** Manage page sections and their items. */
  PAGE_MANAGE: 'page:manage',
  /** List and view product categories. */
  CATEGORY_READ: 'category:read',
  /** Create, update and delete product categories. */
  CATEGORY_MANAGE: 'category:manage',
  /** List and view products, their attributes and variants. */
  PRODUCT_READ: 'product:read',
  /** Create, update and delete products and their variants. */
  PRODUCT_MANAGE: 'product:manage',
  /** List and view product attributes and their values. */
  ATTRIBUTE_READ: 'attribute:read',
  /** Create, update and delete product attributes and their values. */
  ATTRIBUTE_MANAGE: 'attribute:manage',
} as const;

/** Any of these unlocks the management actions in the file manager. */
export const FILE_WRITE_PERMISSIONS = [
  PERMISSIONS.FILE_UPLOAD,
  PERMISSIONS.FILE_CREATE,
  PERMISSIONS.FILE_DELETE,
] as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
