import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Attribute contract — /admin/attributes                                    */
/* -------------------------------------------------------------------------- */

/** `SPEC` = a fixed product description; `VARIANT` = an axis with per-variant price/stock. */
export const AttributeUsageSchema = z.enum(['SPEC', 'VARIANT']);
export type AttributeUsage = z.infer<typeof AttributeUsageSchema>;

export const FilterTypeSchema = z.enum(['CHECKBOX', 'RADIO', 'SELECT', 'RANGE', 'TOGGLE', 'SEARCH']);
export type FilterType = z.infer<typeof FilterTypeSchema>;

export const AdminAttributeValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  sortOrder: z.number().catch(0),
});
export type AdminAttributeValue = z.infer<typeof AdminAttributeValueSchema>;

export const AdminAttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  usage: AttributeUsageSchema,
  filterType: FilterTypeSchema,
  isMultiSelect: z.boolean().catch(true),
  values: z.array(AdminAttributeValueSchema).catch([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type AdminAttribute = z.infer<typeof AdminAttributeSchema>;

/** `GET /admin/attributes` returns the list under an `attributes` key. */
export const AdminAttributeListResponseSchema = z.object({
  attributes: z.array(AdminAttributeSchema),
});

/** Machine names are used as filter keys, so they stay lowercase and dashed. */
export const ATTRIBUTE_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ATTRIBUTE_USAGE_LABELS: Record<AttributeUsage, string> = {
  SPEC: 'مشخصه',
  VARIANT: 'تنوع',
};

export const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  CHECKBOX: 'چک‌باکس',
  RADIO: 'رادیویی',
  SELECT: 'انتخابی',
  RANGE: 'بازه‌ای',
  TOGGLE: 'کلیدی',
  SEARCH: 'جستجو',
};
