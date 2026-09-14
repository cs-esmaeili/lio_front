import { z } from 'zod';

const RawCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  get children() {
    return z.array(RawCategorySchema).nullable().optional();
  },
});

interface MenuItemModel {
  id: number;
  title: string;
  link: string;
  image: string | null;
  sub_menus: MenuItemModel[];
}

export const MenuItemSchema = RawCategorySchema.transform(
  (category): MenuItemModel => ({
    id: category.id,
    title: category.name,
    link: `/product-category/${category.slug ?? category.id}`,
    image: category.imageUrl ?? null,
    sub_menus: (category.children ?? []).map((child) => MenuItemSchema.parse(child)),
  }),
);

export const CategoriesResponseSchema = z.object({
  data: z.object({
    categories: z.array(MenuItemSchema),
  }),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type RawCategory = z.infer<typeof RawCategorySchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
