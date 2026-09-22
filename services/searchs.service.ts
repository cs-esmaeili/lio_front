import http from '@/services/core/clientService';
import { ProductSearchResponseSchema } from '@/typescript/schemas/products/product-search.schema';
import type { ProductSearchItem } from '@/typescript/schemas/products/product-search.schema';
import { ApiError } from '@/utils/api-error';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// CSR — header search. Searches the whole catalogue by product name.
export const searchProductsCSR = async (name: string, limit = 8): Promise<ProductSearchItem[]> => {
  const response = await http.post(`${csrPrefixUrl}/products/search`, {
    name: name.trim(),
    page: 1,
    limit,
  });

  const parsed = ProductSearchResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ جستجوی محصولات نامعتبر است', parsed.error);
  }

  return parsed.data.products;
};
