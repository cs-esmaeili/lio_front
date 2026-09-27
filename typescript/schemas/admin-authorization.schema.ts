import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Admin authorization — /admin/roles, /admin/permissions                    */
/* -------------------------------------------------------------------------- */

export const AdminPermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().catch(null),
});

export const AdminRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().catch(null),
  permissions: z.array(AdminPermissionSchema).catch([]),
});

export const AdminRoleListSchema = z.array(AdminRoleSchema);
export const AdminPermissionListSchema = z.array(AdminPermissionSchema);

export const AuthorizationOkSchema = z.object({
  ok: z.boolean().catch(true),
});

export type AdminPermission = z.infer<typeof AdminPermissionSchema>;
export type AdminRole = z.infer<typeof AdminRoleSchema>;
