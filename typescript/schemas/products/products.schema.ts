import { z } from 'zod';


const BreadcrumbItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().optional(),
  disabled: z.boolean(),
  href: z.url().optional(),
});

const CategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  image: z.url().nullable(),
  description: z.string().nullable(),
  seo_field: z.array(z.unknown()),
});

const ProductCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  image: z.url(),
});

const VariantSchema = z.object({
  id: z.number(),
  barcode: z.string(),
  amount: z.number(),
  final_amount: z.number(),
  discount_percent: z.number(),
  currency_symbol: z.string(),
  attributes: z.string(),
  is_available: z.boolean(),
  zero_price: z.string(),
});

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  barcode: z.string(),
  brand: z.string(),
  image: z.url(),
  categories: z.array(ProductCategorySchema),
  labels: z.array(z.unknown()),
  is_favorite: z.boolean(),
  default_variant: VariantSchema,
});

const PaginationSchema = z.object({
  self: z.url(),
  first: z.url(),
  last: z.url(),
  prev: z.url().nullable(),
  next: z.url().nullable(),
  current_page: z.number(),
  from: z.number(),
  last_page: z.number(),
  path: z.url(),
  per_page: z.number(),
  to: z.number(),
  total: z.number(),
});


export const ProductListResponseSchema = z.object({
  status: z.number(),
  breadcrumb: z.array(BreadcrumbItemSchema),
  category: CategorySchema,
  products: z.array(ProductSchema),
  product_pagination: PaginationSchema,
});


export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
