import { z } from 'zod';

/**
 * Filter view-model consumed by the shop sidebar (`Filters` / `FiltersMobile`).
 * Mirrors the contract produced by `utils/product/ConvertFilters.ts`.
 */
export const CategoryFilterViewSchema = z.object({
  key: z.string(),
  title: z.string(),
  type: z.enum(['checkbox', 'price', 'toggle']),
  multiselect: z.boolean(),
  goToLink: z.boolean(),
  baseLink: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        value: z.union([z.string(), z.number()]),
        slug: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .optional(),
  value: z
    .object({
      min: z.number(),
      max: z.number(),
      selectedMin: z.number(),
      selectedMax: z.number(),
    })
    .optional(),
});

export type CategoryFilterView = z.infer<typeof CategoryFilterViewSchema>;

/* -------------------------------------------------------------------------- */
/*  Raw API shapes — GET /categories/{slug}/filters                            */
/* -------------------------------------------------------------------------- */

const RawFilterValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  sortOrder: z.number().catch(0),
});

const RawFilterSchema = z.object({
  attributeId: z.number(),
  name: z.string(),
  title: z.string(),
  usage: z.enum(['SPEC', 'VARIANT']).catch('SPEC'),
  filterType: z.enum(['CHECKBOX', 'RADIO', 'SELECT', 'RANGE', 'TOGGLE', 'SEARCH']).catch('CHECKBOX'),
  isMultiSelect: z.boolean().catch(false),
  isRequired: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
  values: z.array(RawFilterValueSchema).catch([]),
});

/**
 * `/categories/{slug}/filters` response, transformed into the filter
 * view-model rendered by the shop sidebar.
 *
 * RANGE / TOGGLE / SEARCH controls are not implemented yet, so every filter is
 * rendered through the checkbox control (single-select ones become radio-like).
 */
export const CategoryFiltersSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      filters: z.array(RawFilterSchema).catch([]),
    }),
    message: z.string().optional(),
  })
  .transform((response): CategoryFilterView[] =>
    response.data.filters
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
      ),
  );

export type CategoryFilters = z.infer<typeof CategoryFiltersSchema>;
