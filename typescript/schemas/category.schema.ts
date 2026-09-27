import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Category contract — /admin/categories                                     */
/* -------------------------------------------------------------------------- */

/**
 * A category as returned by the admin API. Unlike the public tree endpoint
 * this is flat (`parentId`, no `children`) so the dashboard can rebuild and
 * reorganize the hierarchy.
 */
export const AdminCategorySchema = z.object({
  id: z.number(),
  parentId: z.number().nullable().catch(null),
  name: z.string(),
  slug: z.string(),
  imageId: z.number().nullable().catch(null),
  imageUrl: z.string().nullable().catch(null),
  childCount: z.number().catch(0),
  productCount: z.number().catch(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type AdminCategory = z.infer<typeof AdminCategorySchema>;

/** `GET /admin/categories` returns the flat list under a `categories` key. */
export const AdminCategoryListResponseSchema = z.object({
  categories: z.array(AdminCategorySchema),
});

/** `data` of `DELETE /admin/categories/{id}`. */
export const CategoryOkSchema = z.object({
  ok: z.boolean().catch(true),
});

/** Slugs travel in public URLs, so they must be a lowercase dashed segment. */
export const CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
