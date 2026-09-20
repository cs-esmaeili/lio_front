import { z } from 'zod';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';

/* -------------------------------------------------------------------------- */
/*  GET /products/sort-options                                                 */
/* -------------------------------------------------------------------------- */

export const ProductSortOptionSchema = z.object({
  key: z.string(),
  title: z.string(),
});

export type ProductSortOption = z.infer<typeof ProductSortOptionSchema>;

export const ProductSortOptionsSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({ sorts: z.array(ProductSortOptionSchema).catch([]) }),
    message: z.string().optional(),
  })
  .transform((response) => response.data.sorts);

/* -------------------------------------------------------------------------- */
/*  GET /products/global-filters                                               */
/* -------------------------------------------------------------------------- */

export const GlobalFilterTypeSchema = z.enum(['CHECKBOX', 'RADIO', 'SELECT', 'RANGE', 'TOGGLE', 'SEARCH']);

/**
 * Global (non-attribute) filters such as price / in-stock / discounted.
 * `RANGE` and `TOGGLE` are mapped into the shop sidebar view-model; the
 * remaining control types are ignored until they get a matching control.
 */
export const ProductGlobalFiltersSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      filters: z
        .array(
          z.object({
            key: z.string(),
            title: z.string(),
            type: GlobalFilterTypeSchema.catch('CHECKBOX'),
          }),
        )
        .catch([]),
    }),
    message: z.string().optional(),
  })
  .transform((response): CategoryFilterView[] => {
    const views: CategoryFilterView[] = [];

    for (const filter of response.data.filters) {
      if (filter.type === 'RANGE') {
        views.push({
          key: filter.key,
          title: filter.title,
          type: 'price',
          multiselect: false,
          goToLink: false,
          value: { min: 0, max: 0, selectedMin: 0, selectedMax: 0 },
        });
      } else if (filter.type === 'TOGGLE') {
        views.push({
          key: filter.key,
          title: filter.title,
          type: 'toggle',
          multiselect: false,
          goToLink: false,
        });
      }
    }

    return views;
  });
