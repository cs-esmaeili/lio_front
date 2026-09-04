import { z } from 'zod';

// --- /api/products-filtering response ---

const AttributeValueSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string().nullable(),
  barcode: z.string().nullable().optional(),
});

const AttributeGroupSchema = z.object({
  id: z.number(),
  title: z.string(),
});

const AttributeSchema = z.object({
  id: z.number(),
  title: z.string(),
  group: AttributeGroupSchema.optional(),
  values: z.array(AttributeValueSchema),
  is_filtering: z.number().optional(),
  select_list: z.number(),
});

export const AttributesResponseSchema = z.object({
  status: z.number(),
  filters: z.object({
    attributes: z.array(AttributeSchema),
  }),
});

export type SigaretobesazAttributeValue = z.infer<typeof AttributeValueSchema>;
export type SigaretobesazAttribute = z.infer<typeof AttributeSchema>;
export type AttributesResponse = z.infer<typeof AttributesResponseSchema>;

// --- /api/search response (sigaretobesaz variant — no breadcrumb/category) ---

const SearchProductCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
});

const SearchVariantSchema = z.object({
  id: z.number(),
  barcode: z.string(),
  amount: z.number(),
  final_amount: z.number(),
  discount_percent: z.number(),
  currency_symbol: z.string(),
  attributes: z.string().nullable(),
  is_available: z.boolean(),
  zero_price: z.string(),
});

const SearchProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  barcode: z.string(),
  brand: z.string(),
  image: z.string().nullable(),
  categories: z.array(SearchProductCategorySchema),
  labels: z.array(z.unknown()),
  is_favorite: z.boolean(),
  default_variant: SearchVariantSchema,
});

const SearchPaginationSchema = z.object({
  self: z.string(),
  first: z.string(),
  last: z.string(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  path: z.string(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});

export const SigaretobesazSearchResponseSchema = z.object({
  status: z.number(),
  products: z.array(SearchProductSchema),
  product_pagination: SearchPaginationSchema,
});

export type SigaretobesazProduct = z.infer<typeof SearchProductSchema>;
export type SigaretobesazPagination = z.infer<typeof SearchPaginationSchema>;
export type SigaretobesazSearchResponse = z.infer<typeof SigaretobesazSearchResponseSchema>;