import { z } from 'zod';

interface FooterLinkModel {
  id: number;
  title: string;
  link: string;
  image: string | null;
  sub_menus: FooterLinkModel[];
}

const GENERAL_SECTION_TITLE = 'دسترسی سریع';
const CATEGORIES_SECTION_TITLE = 'دسته بندی ها';

const FooterLinkSchema = z
  .object({
    id: z.number(),
    label: z.string(),
    url: z.string().nullable().catch(null),
    fileUrl: z.string().nullable().catch(null),
  })
  .transform(
    (link): FooterLinkModel => ({
      id: link.id,
      title: link.label,
      link: link.url ?? '#',
      image: link.fileUrl,
      sub_menus: [],
    }),
  );

const FooterCategorySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
  })
  .transform(
    (category): FooterLinkModel => ({
      id: category.id,
      title: category.name,
      link: category.url,
      image: null,
      sub_menus: [],
    }),
  );

export const FooterSectionSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      id: z.number(),
      type: z.string(),
      location: z.string(),
      data: z.object({
        links: z.array(FooterLinkSchema).default([]),
        categories: z.array(FooterCategorySchema).default([]),
      }),
    }),
    message: z.string().optional(),
  })
  .transform((response): FooterLinkModel[] => [
    {
      id: 1,
      title: GENERAL_SECTION_TITLE,
      link: '#',
      image: null,
      sub_menus: response.data.data.links,
    },
    {
      id: 2,
      title: CATEGORIES_SECTION_TITLE,
      link: '/',
      image: null,
      sub_menus: response.data.data.categories,
    },
  ]);

export type FooterSection = z.infer<typeof FooterSectionSchema>;
export type FooterLink = z.infer<typeof FooterLinkSchema>;
