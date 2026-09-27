import { z } from 'zod';

import { AttributeUsageSchema, FilterTypeSchema } from '@/typescript/schemas/attribute.schema';

/* -------------------------------------------------------------------------- */
/*  Admin product contract — /admin/products                                  */
/* -------------------------------------------------------------------------- */

export const AdminProductImageSchema = z.object({
  id: z.number(),
  fileId: z.number(),
  url: z.string().nullable().catch(null),
  isPrimary: z.boolean().catch(false),
  isThumbnail: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
});
export type AdminProductImage = z.infer<typeof AdminProductImageSchema>;

export const AdminProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});
export type AdminProductCategory = z.infer<typeof AdminProductCategorySchema>;

export const AdminProductSpecValueSchema = z.object({
  attributeId: z.number(),
  attributeValueId: z.number(),
});
export type AdminProductSpecValue = z.infer<typeof AdminProductSpecValueSchema>;

export const AdminProductVariantAxisSchema = z.object({
  attributeId: z.number(),
  valueIds: z.array(z.number()).catch([]),
});
export type AdminProductVariantAxis = z.infer<typeof AdminProductVariantAxisSchema>;

export const AdminProductVariantValueSchema = z.object({
  attributeId: z.number(),
  attributeValueId: z.number(),
});
export type AdminProductVariantValue = z.infer<typeof AdminProductVariantValueSchema>;

export const AdminProductVariantSchema = z.object({
  id: z.number(),
  sku: z.string(),
  price: z.number(),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().catch(0),
  isDefault: z.boolean().catch(false),
  values: z.array(AdminProductVariantValueSchema).catch([]),
});
export type AdminProductVariant = z.infer<typeof AdminProductVariantSchema>;

export const AdminProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().catch(null),
  categories: z.array(AdminProductCategorySchema).catch([]),
  images: z.array(AdminProductImageSchema).catch([]),
  specValues: z.array(AdminProductSpecValueSchema).catch([]),
  variantAxes: z.array(AdminProductVariantAxisSchema).catch([]),
  variants: z.array(AdminProductVariantSchema).catch([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type AdminProduct = z.infer<typeof AdminProductSchema>;

export const AdminAvailableAttributeValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  sortOrder: z.number().catch(0),
});
export type AdminAvailableAttributeValue = z.infer<typeof AdminAvailableAttributeValueSchema>;

export const AdminAvailableAttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  usage: AttributeUsageSchema,
  filterType: FilterTypeSchema,
  isMultiSelect: z.boolean().catch(true),
  isRequired: z.boolean().catch(false),
  isFilterable: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
  values: z.array(AdminAvailableAttributeValueSchema).catch([]),
});
export type AdminAvailableAttribute = z.infer<typeof AdminAvailableAttributeSchema>;

/** `GET /admin/products/{id}` — the product plus the attributes its categories expose. */
export const GetAdminProductResponseSchema = z.object({
  product: AdminProductSchema,
  availableAttributes: z.array(AdminAvailableAttributeSchema).catch([]),
});

/** `GET /admin/products/available-attributes`. */
export const AvailableAttributesResponseSchema = z.object({
  attributes: z.array(AdminAvailableAttributeSchema).catch([]),
});

export const AdminProductListCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const AdminProductListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  primaryImageUrl: z.string().nullable().catch(null),
  categories: z.array(AdminProductListCategorySchema).catch([]),
  variantCount: z.number().catch(0),
  priceFrom: z.number().nullable().catch(null),
  priceTo: z.number().nullable().catch(null),
  totalStock: z.number().catch(0),
  updatedAt: z.string().optional(),
});
export type AdminProductListItem = z.infer<typeof AdminProductListItemSchema>;

export const AdminProductListResponseSchema = z.object({
  items: z.array(AdminProductListItemSchema).catch([]),
  page: z.number().catch(1),
  limit: z.number().catch(20),
  total: z.number().catch(0),
  totalPages: z.number().catch(1),
});
export type AdminProductListResponse = z.infer<typeof AdminProductListResponseSchema>;

export const AdminProductOkSchema = z.object({
  ok: z.boolean().catch(true),
});

/** Slugs travel in public URLs, so they must be a lowercase dashed segment. */
export const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* -------------------------------------------------------------------------- */
/*  Save payload (outbound)                                                   */
/* -------------------------------------------------------------------------- */

export const ProductImageInputSchema = z.object({
  fileId: z.number(),
  isPrimary: z.boolean().optional(),
  isThumbnail: z.boolean().optional(),
  sortOrder: z.number().optional(),
});
export type ProductImageInput = z.infer<typeof ProductImageInputSchema>;

export const ProductSpecValueInputSchema = z.object({
  attributeId: z.number(),
  attributeValueId: z.number(),
});

export const ProductVariantAxisInputSchema = z.object({
  attributeId: z.number(),
  valueIds: z.array(z.number()),
});

export const ProductVariantValueInputSchema = z.object({
  attributeId: z.number(),
  attributeValueId: z.number(),
});

export const ProductVariantInputSchema = z.object({
  sku: z.string().optional(),
  price: z.number(),
  compareAtPrice: z.number().nullable().optional(),
  stock: z.number(),
  isDefault: z.boolean().optional(),
  values: z.array(ProductVariantValueInputSchema),
});
export type ProductVariantInput = z.infer<typeof ProductVariantInputSchema>;

export const SaveProductPayloadSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  categoryIds: z.array(z.number()),
  images: z.array(ProductImageInputSchema),
  specValues: z.array(ProductSpecValueInputSchema),
  variantAxes: z.array(ProductVariantAxisInputSchema),
  variants: z.array(ProductVariantInputSchema),
});
export type SaveProductPayload = z.infer<typeof SaveProductPayloadSchema>;

/** A combination key used by the editor to track generated variants (`attr:value|attr:value`). */
export function variantCombinationKey(values: Array<{ attributeId: number; attributeValueId: number }>): string {
  return values
    .slice()
    .sort((a, b) => a.attributeId - b.attributeId)
    .map((value) => `${value.attributeId}:${value.attributeValueId}`)
    .join('|');
}
