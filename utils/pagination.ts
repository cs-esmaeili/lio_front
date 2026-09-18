import { z } from 'zod';
import { DEFAULT_PAGINATION } from '@/typescript/schemas/pagination.schema';
import type { Pagination } from '@/typescript/schemas/pagination.schema';

const RawPaginationSchema = z.object({
  page: z.number().optional(),
  current_page: z.number().optional(),
  limit: z.number().optional(),
  per_page: z.number().optional(),
  total: z.number().optional(),
  totalPages: z.number().optional(),
  last_page: z.number().optional(),
  hasNextPage: z.boolean().optional(),
  hasPreviousPage: z.boolean().optional(),
});

/**
 * Accepts either the standard pagination contract or the legacy Laravel links
 * (`current_page` / `last_page` / `per_page`) and normalises both to `Pagination`.
 */
export const normalizePagination = (raw: unknown): Pagination => {
  const parsed = RawPaginationSchema.safeParse(raw);
  if (!parsed.success) return DEFAULT_PAGINATION;

  const { page, current_page, limit, per_page, total, totalPages, last_page, hasNextPage, hasPreviousPage } = parsed.data;

  const normalizedPage = page ?? current_page ?? 1;
  const normalizedTotalPages = totalPages ?? last_page ?? 1;

  return {
    page: normalizedPage,
    limit: limit ?? per_page ?? 0,
    total: total ?? 0,
    totalPages: normalizedTotalPages,
    hasNextPage: hasNextPage ?? normalizedPage < normalizedTotalPages,
    hasPreviousPage: hasPreviousPage ?? normalizedPage > 1,
  };
};
