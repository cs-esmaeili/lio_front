import { ProductSortSchema } from '@/typescript/schemas/products/product-search.schema';
import type { ProductSearchRequest } from '@/typescript/schemas/products/product-search.schema';

const ATTRIBUTE_PARAM = /^attribute_values\[(\d+)\]$/;

const readPositiveNumber = (params: URLSearchParams, key: string): number | undefined => {
  const raw = params.get(key);

  if (raw == null || raw.trim() === '') return undefined;

  const value = Number(raw);

  return Number.isFinite(value) && value > 0 ? value : undefined;
};

/**
 * Converts the shop URL params into the payload expected by
 * `POST /products/search`.
 *
 * - `categorySlug` → omitted when empty, so the whole catalogue is searched
 * - `name` → optional name match (e.g. from the header search)
 * - repeated `attribute_values[{id}]` → `filters` (OR within one attribute)
 * - `minPrice` / `maxPrice` → price range of the default variant
 * - `inStock` / `hasDiscount` → `"1"` flags
 * - `sort` → one of `newest | cheapest | most_expensive`
 */
export const buildProductSearchBody = (categorySlug: string | null, params: URLSearchParams): ProductSearchRequest => {
  const filters = new Map<number, number[]>();

  params.forEach((value, key) => {
    const match = ATTRIBUTE_PARAM.exec(key);
    if (!match) return;

    const attributeId = Number(match[1]);
    const valueId = Number(value);

    if (!Number.isInteger(attributeId) || !Number.isInteger(valueId)) return;

    const valueIds = filters.get(attributeId) ?? [];
    if (!valueIds.includes(valueId)) valueIds.push(valueId);
    filters.set(attributeId, valueIds);
  });

  const body: ProductSearchRequest = {
    filters: Array.from(filters, ([attributeId, valueIds]) => ({ attributeId, valueIds })),
  };

  const slug = categorySlug?.trim();
  if (slug) body.categorySlug = slug;

  const name = params.get('name')?.trim();
  if (name) body.name = name;

  const minPrice = readPositiveNumber(params, 'minPrice');
  if (minPrice !== undefined) body.minPrice = minPrice;

  const maxPrice = readPositiveNumber(params, 'maxPrice');
  if (maxPrice !== undefined) body.maxPrice = maxPrice;

  if (params.get('inStock') === '1') body.inStock = true;
  if (params.get('hasDiscount') === '1') body.hasDiscount = true;

  const sort = ProductSortSchema.safeParse(params.get('sort'));
  if (sort.success) body.sort = sort.data;

  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));

  if (Number.isInteger(page) && page > 0) body.page = page;
  if (Number.isInteger(limit) && limit > 0) body.limit = limit;

  return body;
};
