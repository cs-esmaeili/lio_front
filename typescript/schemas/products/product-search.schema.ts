import { z } from 'zod';
import { PaginationSchema, DEFAULT_PAGINATION } from '@/typescript/schemas/pagination.schema';

/* -------------------------------------------------------------------------- */
/*  Request — POST /products/search                                            */
/* -------------------------------------------------------------------------- */

export const ProductSearchFilterSchema = z.object({
  attributeId: z.number().int(),
  valueIds: z.array(z.number().int()),
});

export const ProductSearchRequestSchema = z.object({
  categorySlug: z.string(),
  filters: z.array(ProductSearchFilterSchema),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type ProductSearchFilter = z.infer<typeof ProductSearchFilterSchema>;
export type ProductSearchRequest = z.infer<typeof ProductSearchRequestSchema>;

/* -------------------------------------------------------------------------- */
/*  Response — POST /products/search                                           */
/* -------------------------------------------------------------------------- */

const RawProductImageSchema = z.object({
  id: z.number(),
  url: z.string().nullable().catch(null),
  isPrimary: z.boolean().catch(false),
  isThumbnail: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
});

const RawProductVariantSchema = z.object({
  id: z.number(),
  sku: z.string().nullable().catch(null),
  price: z.number().catch(0),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().catch(0),
});

const RawProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  images: z.array(RawProductImageSchema).catch([]),
  defaultVariant: RawProductVariantSchema.nullable().catch(null),
});

/**
 * Normalises the API product into the legacy card contract consumed by
 * `ProductCard` / `ProductCardHorizontal` (`default_variant`, `image`,
 * `productName`/`productSlug`).
 */
export const ProductSearchItemSchema = RawProductSchema.transform((product) => {
  const variant = product.defaultVariant;
  const price = variant?.price ?? 0;
  const compareAtPrice = variant?.compareAtPrice ?? price;
  const stock = variant?.stock ?? 0;

  const discountPercent =
    compareAtPrice > price && compareAtPrice > 0 ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const image = primaryImage?.url ?? '';

  return {
    id: product.id,
    title: product.name,
    slug: product.slug,
    productName: product.name,
    productSlug: product.slug,
    image,
    images: product.images,
    default_variant: {
      id: variant?.id ?? 0,
      amount: compareAtPrice,
      final_amount: price,
      discount_percent: discountPercent,
      is_available: stock > 0,
      zero_price: price > 0 ? '' : 'call',
    },
  };
});

export const ProductSearchResponseSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      products: z.array(ProductSearchItemSchema).catch([]),
      pagination: PaginationSchema.catch(DEFAULT_PAGINATION),
    }),
    message: z.string().optional(),
  })
  .transform((response) => ({
    products: response.data.products,
    product_pagination: response.data.pagination,
  }));

export type ProductSearchItem = z.infer<typeof ProductSearchItemSchema>;
export type ProductSearchResults = z.infer<typeof ProductSearchResponseSchema>;
