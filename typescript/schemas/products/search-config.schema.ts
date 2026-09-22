import { z } from 'zod';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';
import { ProductSortOptionSchema } from '@/typescript/schemas/products/product-options.schema';

/* -------------------------------------------------------------------------- */
/*  GET /products/search-config                                                */
/* -------------------------------------------------------------------------- */

const SearchConfigControlTypeSchema = z.enum(['CHECKBOX', 'RADIO', 'SELECT', 'RANGE', 'TOGGLE', 'SEARCH']);

const SearchConfigGlobalFilterSchema = z.object({
  key: z.string(),
  title: z.string(),
  type: SearchConfigControlTypeSchema.catch('CHECKBOX'),
});

const SearchConfigCategoryFilterSchema = z.object({
  attributeId: z.number(),
  name: z.string(),
  title: z.string(),
  usage: z.enum(['SPEC', 'VARIANT']).catch('SPEC'),
  filterType: SearchConfigControlTypeSchema.catch('CHECKBOX'),
  isMultiSelect: z.boolean().catch(false),
  isRequired: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
  values: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
        sortOrder: z.number().catch(0),
      }),
    )
    .catch([]),
});

const toGlobalFilterViews = (
  filters: z.infer<typeof SearchConfigGlobalFilterSchema>[],
): CategoryFilterView[] => {
  const views: CategoryFilterView[] = [];

  for (const filter of filters) {
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
};

const toCategoryFilterViews = (
  filters: z.infer<typeof SearchConfigCategoryFilterSchema>[],
): CategoryFilterView[] =>
  filters
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(
      (filter): CategoryFilterView => ({
        key: `attribute_values[${filter.attributeId}]`,
        title: filter.title || filter.name,
        type: 'checkbox',
        multiselect: filter.isMultiSelect,
        goToLink: false,
        items: filter.values.map((value) => ({
          id: value.id,
          title: value.value,
          value: value.id,
        })),
      }),
    );

/**
 * `GET /products/search-config` returns the full listing-page config in one
 * request: the global filters, the sort options and (when a `categorySlug` is
 * sent) the category attribute filters. It is transformed into the same
 * `{ filters, sort_options }` view-model the shop sidebar already consumes.
 *
 * RANGE / TOGGLE global filters are mapped to their controls; the remaining
 * global control types are ignored until they get a matching control. Category
 * attribute filters are always rendered through the checkbox control.
 */
export const ProductSearchConfigSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      globalFilters: z.array(SearchConfigGlobalFilterSchema).catch([]),
      sorts: z.array(ProductSortOptionSchema).catch([]),
      categoryFilters: z.array(SearchConfigCategoryFilterSchema).nullable().catch(null),
    }),
    message: z.string().optional(),
  })
  .transform((response) => ({
    filters: [
      ...toGlobalFilterViews(response.data.globalFilters),
      ...toCategoryFilterViews(response.data.categoryFilters ?? []),
    ],
    sort_options: response.data.sorts,
  }));

export type ProductSearchConfig = z.infer<typeof ProductSearchConfigSchema>;
