import type { ProductSearchRequest } from '@/typescript/schemas/products/product-search.schema';

const ATTRIBUTE_PARAM = /^attribute_values\[(\d+)\]$/;

/**
 * Converts the `attribute_values[{id}]` URL params used by the shop sidebar
 * into the `filters` payload expected by `POST /products/search`.
 * Repeated params become `valueIds` (OR within one attribute).
 */
export const buildProductSearchBody = (categorySlug: string, params: URLSearchParams): ProductSearchRequest => {
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
    categorySlug,
    filters: Array.from(filters, ([attributeId, valueIds]) => ({ attributeId, valueIds })),
  };

  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));

  if (Number.isInteger(page) && page > 0) body.page = page;
  if (Number.isInteger(limit) && limit > 0) body.limit = limit;

  return body;
};
