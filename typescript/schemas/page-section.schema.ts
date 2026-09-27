import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Page sections — /page-sections, /admin/page-sections/{id}/data            */
/* -------------------------------------------------------------------------- */

/** SLIDER section slide (`data.slides[]`). */
export const SliderSlideSchema = z.object({
  id: z.number(),
  desktopFileId: z.number(),
  tabletFileId: z.number(),
  mobileFileId: z.number(),
  desktopFileUrl: z.string().nullable().catch(null),
  tabletFileUrl: z.string().nullable().catch(null),
  mobileFileUrl: z.string().nullable().catch(null),
  url: z.string().nullable().catch(null),
});

export const SliderSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    slides: z.array(SliderSlideSchema).catch([]),
  }),
});

export type SliderSlide = z.infer<typeof SliderSlideSchema>;
export type SliderSection = z.infer<typeof SliderSectionSchema>;

/**
 * Payload for creating/updating a slide. `id` is required when updating and
 * omitted when creating.
 */
export interface SliderSlideInput {
  id?: number;
  desktopFileId: number;
  tabletFileId: number;
  mobileFileId: number;
  url?: string | null;
  sortOrder?: number;
}
