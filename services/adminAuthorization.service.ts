import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  AdminPermissionListSchema,
  AdminRoleListSchema,
  AdminRoleSchema,
  AuthorizationOkSchema,
  type AdminPermission,
  type AdminRole,
} from '@/typescript/schemas/admin-authorization.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

/* -------------------------------------------------------------------------- */
/*  Response parsing                                                          */
/* -------------------------------------------------------------------------- */

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
function unwrap(body: unknown): unknown {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: unknown }).data;
  }
  return body;
}

async function parseResponse<T>(request: Promise<AxiosResponse>, schema: z.ZodType<T>): Promise<T> {
  const response = await request;

  const parsed = schema.safeParse(unwrap(response.data));
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
}

/* -------------------------------------------------------------------------- */
/*  Roles — /admin/roles                                                      */
/* -------------------------------------------------------------------------- */

export interface RolePayload {
  name: string;
  description?: string | null;
  permissionIds?: number[];
}

/** GET /admin/roles — every role with its permissions (requires `role:read`). */
export const listRolesCSR = (): Promise<AdminRole[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/roles`), AdminRoleListSchema);

/** GET /admin/roles/{id} — a single role. */
export const getRoleCSR = (id: number): Promise<AdminRole> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/roles/${id}`), AdminRoleSchema);

/** POST /admin/roles — create a role (requires `role:write`). */
export const createRoleCSR = (payload: RolePayload): Promise<AdminRole> =>
  parseResponse(http.post(`${csrPrefixUrl}/admin/roles`, payload), AdminRoleSchema);

/** PATCH /admin/roles/{id} — update a role. */
export const updateRoleCSR = (id: number, payload: Partial<RolePayload>): Promise<AdminRole> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/roles/${id}`, payload), AdminRoleSchema);

/** DELETE /admin/roles/{id} — delete a role. */
export const deleteRoleCSR = (id: number): Promise<{ ok: boolean }> =>
  parseResponse(http.delete(`${csrPrefixUrl}/admin/roles/${id}`), AuthorizationOkSchema);

/* -------------------------------------------------------------------------- */
/*  Permissions — /admin/permissions                                          */
/* -------------------------------------------------------------------------- */

/** GET /admin/permissions — every permission (requires `permission:read`). */
export const listPermissionsCSR = (): Promise<AdminPermission[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/permissions`), AdminPermissionListSchema);
