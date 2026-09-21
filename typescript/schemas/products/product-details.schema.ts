import { z } from 'zod';
import { resolveFileUrl } from '@/utils/fileUrl';

/* -------------------------------------------------------------------------- */
/*  Raw + shared pieces — GET /products/{slug}/details                         */
/* -------------------------------------------------------------------------- */

export const ProductImageSchema = z.object({
  id: z.number(),
  url: z.string().nullable().catch(null),
  isPrimary: z.boolean().catch(false),
  isThumbnail: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

const ProductVariantValueSchema = z.object({
  attributeId: z.number(),
  attributeTitle: z.string(),
  valueId: z.number(),
  valueTitle: z.string(),
});

export const ProductVariantSchema = z.object({
  id: z.number(),
  sku: z.string().nullable().catch(null),
  values: z.array(ProductVariantValueSchema).catch([]),
  price: z.number().catch(0),
  compareAtPrice: z.number().nullable().catch(null),
  discountPercent: z.number().catch(0),
  stock: z.number().catch(0),
  isAvailable: z.boolean().catch(false),
  zeroPrice: z.string().nullable().catch(null),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

const ProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable().catch(null),
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

const ProductTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type ProductTag = z.infer<typeof ProductTagSchema>;

const BaseAttributeValueSchema = z.object({
  valueId: z.number(),
  title: z.string(),
  isSelected: z.boolean().catch(false),
});

const BaseAttributeSchema = z.object({
  attributeId: z.number(),
  title: z.string(),
  values: z.array(BaseAttributeValueSchema).catch([]),
});

export type BaseAttribute = z.infer<typeof BaseAttributeSchema>;
export type BaseAttributeValue = z.infer<typeof BaseAttributeValueSchema>;

/* Spec attributes — grouped features shown in the product panel / features tab. */

const AttributeGroupAttributeSchema = z.object({
  valueId: z.number(),
  title: z.string(),
  value: z.string(),
});

const AttributeGroupSchema = z.object({
  attributeId: z.number(),
  title: z.string(),
  attributes: z.array(AttributeGroupAttributeSchema).catch([]),
});

export type AttributeGroup = z.infer<typeof AttributeGroupSchema>;

/* -------------------------------------------------------------------------- */
/*  Main product                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Product images / category images are resolved to absolute URLs here so the
 * render layer never has to know about the backend host.
 */
const ProductSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().catch(null),
    images: z.array(ProductImageSchema).catch([]),
    categories: z.array(ProductCategorySchema).catch([]),
    tags: z.array(ProductTagSchema).catch([]),
    defaultVariant: ProductVariantSchema.nullable().catch(null),
  })
  .transform((product) => ({
    ...product,
    images: product.images
      .slice()
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
      .map((image) => ({ ...image, url: resolveFileUrl(image.url) })),
    categories: product.categories.map((category) => ({
      ...category,
      imageUrl: resolveFileUrl(category.imageUrl),
    })),
  }));

export type ProductDetailsProduct = z.infer<typeof ProductSchema>;

/* -------------------------------------------------------------------------- */
/*  Related product cards (sections.similar / sections.newProducts)            */
/* -------------------------------------------------------------------------- */

const RawCardVariantSchema = z.object({
  id: z.number(),
  sku: z.string().nullable().catch(null),
  price: z.number().catch(0),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().catch(0),
});

const RawCardProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  images: z.array(ProductImageSchema).catch([]),
  defaultVariant: RawCardVariantSchema.nullable().catch(null),
});

/**
 * `ProductCard` still renders the legacy card contract
 * (`default_variant` / `final_amount` / `amount` / `discount_percent`),
 * so relation products are normalised to it here.
 */
export const ProductCardItemSchema = RawCardProductSchema.transform((product) => {
  const variant = product.defaultVariant;
  const price = variant?.price ?? 0;
  const compareAtPrice = variant?.compareAtPrice ?? price;
  const stock = variant?.stock ?? 0;

  const discountPercent =
    compareAtPrice > price && compareAtPrice > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];

  return {
    id: product.id,
    title: product.name,
    productName: product.name,
    slug: product.slug,
    productSlug: product.slug,
    images: product.images.map((image) => ({ ...image, url: resolveFileUrl(image.url) })),
    image: resolveFileUrl(primaryImage?.url) ?? '',
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

export type ProductCardItem = z.infer<typeof ProductCardItemSchema>;

/* -------------------------------------------------------------------------- */
/*  Response                                                                  */
/* -------------------------------------------------------------------------- */

export const ProductDetailsSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      product: ProductSchema,
      baseAttributes: z.array(BaseAttributeSchema).catch([]),
      attributeGroups: z.array(AttributeGroupSchema).catch([]),
      variants: z.array(ProductVariantSchema).catch([]),
      sections: z.object({
        similar: z.array(ProductCardItemSchema).catch([]),
        newProducts: z.array(ProductCardItemSchema).catch([]),
      }),
    }),
    message: z.string().optional(),
  })
  .transform((response) => response.data);

export type ProductDetails = z.infer<typeof ProductDetailsSchema>;
