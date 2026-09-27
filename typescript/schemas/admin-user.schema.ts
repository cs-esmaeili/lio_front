import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Admin users — /admin/users, /admin/roles                                  */
/* -------------------------------------------------------------------------- */

export const USER_STATUSES = ['ACTIVE', 'DISABLED', 'BANNED'] as const;

export const UserStatusSchema = z.enum(USER_STATUSES);

export const AdminUserRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().catch(null),
});

export const AdminUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().nullable().catch(null),
  lastName: z.string().nullable().catch(null),
  nationalCode: z.string().nullable().catch(null),
  status: UserStatusSchema.catch('ACTIVE'),
  role: AdminUserRoleSchema.nullable().catch(null),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const AdminUserListResponseSchema = z.object({
  items: z.array(AdminUserSchema).catch([]),
  page: z.number().catch(1),
  limit: z.number().catch(20),
  total: z.number().catch(0),
  totalPages: z.number().catch(1),
});

/** A role as returned by `GET /admin/roles` (permissions are ignored by the users UI). */
export const AdminRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().catch(null),
});

export const AdminRoleListSchema = z.array(AdminRoleSchema);

export const UserOkSchema = z.object({
  ok: z.boolean().catch(true),
});

export type UserStatus = z.infer<typeof UserStatusSchema>;
export type AdminUserRole = z.infer<typeof AdminUserRoleSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUserListResponse = z.infer<typeof AdminUserListResponseSchema>;
export type AdminRole = z.infer<typeof AdminRoleSchema>;
