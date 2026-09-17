import { z } from 'zod';
import type { MenuItem } from '@/typescript/schemas/header/menu.schema';

const RawHeaderChildSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  get children() {
    return z.array(RawHeaderChildSchema).default([]);
  },
});

const HeaderChildSchema = RawHeaderChildSchema.transform(
  (child): MenuItem => ({
    id: child.id,
    title: child.name,
    link: child.url,
    image: null,
    sub_menus: child.children.map((item) => HeaderChildSchema.parse(item)),
  }),
);

const RawHeaderItemSchema = z.object({
  id: z.number(),
  type: z.enum(['LINK', 'CATEGORY']),
  label: z.string(),
  url: z.string().nullable().catch(null),
  categoryId: z.number().nullable().catch(null),
  get children() {
    return z.array(HeaderChildSchema).default([]);
  },
});

const HeaderItemSchema = RawHeaderItemSchema.transform(
  (item): MenuItem => ({
    id: item.id,
    title: item.label,
    link:
      item.url ??
      (item.categoryId !== null ? `/product-category/${item.categoryId}` : '/'),
    image: null,
    sub_menus: item.children,
  }),
);

export const HeaderSectionSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    id: z.number(),
    type: z.string(),
    location: z.string(),
    data: z.object({
      slogan: z.string().nullable().catch(null),
      supportPhone: z.string().nullable().catch(null),
      logo: z
        .object({
          small: z.string().nullable().catch(null),
          large: z.string().nullable().catch(null),
        })
        .nullable()
        .catch(null),
      items: z.array(HeaderItemSchema),
    }),
  }),
  message: z.string().optional(),
});

export type HeaderSection = z.infer<typeof HeaderSectionSchema>;
