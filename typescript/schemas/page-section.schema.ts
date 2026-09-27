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

/* -------------------------------------------------------------------------- */
/*  BANNER sections                                                           */
/* -------------------------------------------------------------------------- */

/** A single banner (`data.banners[]`). */
export const BannerItemSchema = z.object({
  id: z.number(),
  sortOrder: z.number().catch(0),
  title: z.string().catch(''),
  subtitle: z.string().nullable().catch(null),
  buttonTitle: z.string().nullable().catch(null),
  buttonUrl: z.string().nullable().catch(null),
  desktopFileId: z.number(),
  tabletFileId: z.number(),
  mobileFileId: z.number(),
  desktopFileUrl: z.string().nullable().catch(null),
  tabletFileUrl: z.string().nullable().catch(null),
  mobileFileUrl: z.string().nullable().catch(null),
});

/** A BANNER page section with its banners. */
export const BannerSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    banners: z.array(BannerItemSchema).catch([]),
  }),
});

/** `GET /page-sections/page?entityType=HOME` — every home section, data untyped. */
export const HomeSectionsPageSchema = z.object({
  page: z.object({
    id: z.number(),
    entityType: z.string(),
    entityId: z.number().nullable().catch(null),
    slug: z.string().nullable().catch(null),
  }),
  sections: z
    .array(
      z.object({
        id: z.number(),
        pageId: z.number().nullable().catch(null),
        type: z.string(),
        location: z.string(),
        title: z.string().nullable().catch(null),
        link: z.string().nullable().catch(null),
        sortOrder: z.number().catch(0),
        status: z.string().catch('ACTIVE'),
        data: z.unknown(),
      }),
    )
    .catch([]),
});

export type BannerItem = z.infer<typeof BannerItemSchema>;
export type BannerSection = z.infer<typeof BannerSectionSchema>;
export type HomeSectionsPage = z.infer<typeof HomeSectionsPageSchema>;

/** Payload for creating/updating a banner. `id` is required when updating. */
export interface BannerItemInput {
  id?: number;
  title: string;
  subtitle?: string | null;
  buttonTitle?: string | null;
  buttonUrl?: string | null;
  desktopFileId: number;
  tabletFileId: number;
  mobileFileId: number;
  sortOrder?: number;
}

/* -------------------------------------------------------------------------- */
/*  INTRODUCTION section (singleton)                                          */
/* -------------------------------------------------------------------------- */

export const IntroductionSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    titles: z.record(z.string(), z.string()).catch({}),
    desktopFileId: z.number().nullable().catch(null),
    tabletFileId: z.number().nullable().catch(null),
    mobileFileId: z.number().nullable().catch(null),
    desktopFileUrl: z.string().nullable().catch(null),
    tabletFileUrl: z.string().nullable().catch(null),
    mobileFileUrl: z.string().nullable().catch(null),
  }),
});

export type IntroductionSection = z.infer<typeof IntroductionSectionSchema>;

/** Payload for creating/updating the introduction (upsert). */
export interface IntroductionInput {
  titles: Record<string, string>;
  desktopFileId: number;
  tabletFileId?: number | null;
  mobileFileId?: number | null;
}
