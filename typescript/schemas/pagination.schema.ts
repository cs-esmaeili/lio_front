import { z } from 'zod';

/**
 * Standard pagination contract returned by list endpoints.
 * `{ page, limit, total, totalPages, hasNextPage, hasPreviousPage }`
 */
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
