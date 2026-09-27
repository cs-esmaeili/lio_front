import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  AdminRoleListSchema,
  AdminUserListResponseSchema,
  AdminUserSchema,
  UserOkSchema,
  type AdminRole,
  type AdminUser,
  type AdminUserListResponse,
  type UserStatus,
} from '@/typescript/schemas/admin-user.schema';

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
/*  Users — /admin/users                                                      */
/* -------------------------------------------------------------------------- */

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  roleId?: number;
}

/** GET /admin/users — paginated, searchable users list (requires `user:read`). */
export const listUsersCSR = (query: AdminUserListQuery = {}): Promise<AdminUserListResponse> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/users`, { params: query }), AdminUserListResponseSchema);

/** GET /admin/users/{id} — a single user. */
export const getUserCSR = (id: number): Promise<AdminUser> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/users/${id}`), AdminUserSchema);

/** PATCH /admin/users/{id}/status — change a user status (requires `user:manage`). */
export const updateUserStatusCSR = (id: number, status: UserStatus): Promise<AdminUser> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/users/${id}/status`, { status }), AdminUserSchema);

/* -------------------------------------------------------------------------- */
/*  Roles — /admin/roles, /admin/users/{id}/role                              */
/* -------------------------------------------------------------------------- */

/** GET /admin/roles — every role (requires `role:read`). */
export const listRolesCSR = (): Promise<AdminRole[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/roles`), AdminRoleListSchema);

/** PATCH /admin/users/{userId}/role — assign or clear a user role. */
export const assignUserRoleCSR = (userId: number, roleId: number | null): Promise<{ ok: boolean }> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/users/${userId}/role`, { roleId }), UserOkSchema);
