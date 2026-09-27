import type { AdminUser, UserStatus } from '@/typescript/schemas/admin-user.schema';

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'فعال',
  DISABLED: 'غیرفعال',
  BANNED: 'مسدود',
};

/** Token classes for each status badge. */
export const USER_STATUS_CLASSES: Record<UserStatus, string> = {
  ACTIVE: 'bg-primary-0/15 text-primary-0',
  DISABLED: 'bg-gray-1 text-secondary-1',
  BANNED: 'bg-custom-red/10 text-custom-red',
};

/** Display name, falling back to the username. */
export function getDisplayName(user: Pick<AdminUser, 'name' | 'lastName' | 'username'>): string {
  const full = [user.name, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.username;
}

/** Initial letter for the avatar fallback. */
export function getInitial(user: Pick<AdminUser, 'name' | 'username'>): string {
  return (user.name || user.username || '؟').trim().charAt(0);
}
