// services/schemas/filters.schema.ts
import { z } from 'zod'

// --- Sub Schemas ---

const BrandSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
})

const CategorySchema = z.object({
  title: z.string(),
  slug: z.string(),
})

const AttributeSchema = z.unknown()

const SortOptionSchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
})

// --- Filters Schema ---

const FiltersSchema = z.object({
  brands: z.array(BrandSchema),
  categories: z.array(CategorySchema),
  attributes: z.array(AttributeSchema),
  min_amount: z.number(),
  max_amount: z.number(),
})

// --- Main Response Schema ---

export const FiltersResponseSchema = z.object({
  status: z.number(),
  filters: FiltersSchema,
  sort_options: z.array(SortOptionSchema),
})

// --- Types ---

export type FiltersResponse = z.infer<typeof FiltersResponseSchema>
export type Filters = z.infer<typeof FiltersSchema>
export type Brand = z.infer<typeof BrandSchema>
export type Category = z.infer<typeof CategorySchema>
export type SortOption = z.infer<typeof SortOptionSchema>