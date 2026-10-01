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

/* -------------------------------------------------------------------------- */
/*  HEADER section                                                            */
/* -------------------------------------------------------------------------- */

export const HEADER_ITEM_TYPES = ['LINK', 'CATEGORY'] as const;

/** A header menu item (`data.items[]`). CATEGORY items resolve to a category. */
export const HeaderItemSchema = z.object({
  id: z.number(),
  type: z.enum(HEADER_ITEM_TYPES).catch('LINK'),
  label: z.string().catch(''),
  url: z.string().nullable().catch(null),
  categoryId: z.number().nullable().catch(null),
});

export const HeaderSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    logo: z.object({
      small: z.string().nullable().catch(null),
      large: z.string().nullable().catch(null),
    }),
    supportPhone: z.string().nullable().catch(null),
    slogan: z.string().nullable().catch(null),
    items: z.array(HeaderItemSchema).catch([]),
  }),
});

export type HeaderItemType = (typeof HEADER_ITEM_TYPES)[number];
export type HeaderItem = z.infer<typeof HeaderItemSchema>;
export type HeaderSection = z.infer<typeof HeaderSectionSchema>;

/** Payload for creating/updating a header item. `id` is required when updating. */
export interface HeaderItemInput {
  id?: number;
  type: HeaderItemType;
  label?: string | null;
  url?: string | null;
  categoryId?: number | null;
  sortOrder?: number;
}

/* -------------------------------------------------------------------------- */
/*  FOOTER section                                                            */
/* -------------------------------------------------------------------------- */

export const FOOTER_ITEM_TYPES = ['LINK', 'CATEGORY'] as const;

/** A footer link item (`data.links[]`). */
export const FooterLinkItemSchema = z.object({
  id: z.number(),
  label: z.string().catch(''),
  url: z.string().nullable().catch(null),
  description: z.string().nullable().catch(null),
  fileId: z.number().nullable().catch(null),
  fileUrl: z.string().nullable().catch(null),
});

/** A footer category item (`data.categories[]`). */
export const FooterCategoryItemSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  name: z.string().catch(''),
  url: z.string().nullable().catch(null),
});

export const FooterSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    logo: z.object({
      small: z.string().nullable().catch(null),
      large: z.string().nullable().catch(null),
    }),
    description: z.string().nullable().catch(null),
    slogan: z.string().nullable().catch(null),
    supportPhone: z.string().nullable().catch(null),
    links: z.array(FooterLinkItemSchema).catch([]),
    categories: z.array(FooterCategoryItemSchema).catch([]),
  }),
});

export type FooterItemType = (typeof FOOTER_ITEM_TYPES)[number];
export type FooterLinkItem = z.infer<typeof FooterLinkItemSchema>;
export type FooterCategoryItem = z.infer<typeof FooterCategoryItemSchema>;
export type FooterSection = z.infer<typeof FooterSectionSchema>;

/** Payload for creating/updating a footer item. `id` is required when updating. */
export interface FooterItemInput {
  id?: number;
  type: FooterItemType;
  label?: string | null;
  url?: string | null;
  description?: string | null;
  fileId?: number | null;
  categoryId?: number | null;
  sortOrder?: number;
}

/** Normalized shape the footer editor form starts from (link or category item). */
export interface FooterEditorInit {
  id: number;
  type: FooterItemType;
  label: string;
  url: string | null;
  description: string | null;
  fileId: number | null;
  fileUrl: string | null;
  categoryId: number | null;
}

/* -------------------------------------------------------------------------- */
/*  PRODUCT_LIST sections                                                     */
/* -------------------------------------------------------------------------- */

export const ProductListImageSchema = z.object({
  id: z.number(),
  url: z.string().nullable().catch(null),
  isPrimary: z.boolean().catch(false),
  isThumbnail: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
});

export const ProductListDefaultVariantSchema = z.object({
  id: z.number(),
  sku: z.string().catch(''),
  price: z.number().catch(0),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().catch(0),
});

/** A product row inside `data.products[]`. */
export const ProductListItemSchema = z.object({
  id: z.number(),
  sortOrder: z.number().catch(0),
  productId: z.number(),
  productName: z.string().catch(''),
  productSlug: z.string().catch(''),
  images: z.array(ProductListImageSchema).catch([]),
  defaultVariant: ProductListDefaultVariantSchema.nullable().catch(null),
});

export const ProductListSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    products: z.array(ProductListItemSchema).catch([]),
  }),
});

export type ProductListImage = z.infer<typeof ProductListImageSchema>;
export type ProductListDefaultVariant = z.infer<typeof ProductListDefaultVariantSchema>;
export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type ProductListSection = z.infer<typeof ProductListSectionSchema>;

/** Payload for creating/updating a product-list row. `id` is required when updating. */
export interface ProductListItemInput {
  id?: number;
  productId: number;
  sortOrder?: number;
}

/* -------------------------------------------------------------------------- */
/*  CONTACT section (singleton)                                               */
/* -------------------------------------------------------------------------- */

/** A social link shown on the contact page (stored in the `socials` site setting). */
export const ContactSocialSchema = z.object({
  key: z.string(),
  title: z.string().catch(''),
  image: z.string().catch(''),
  fullUrl: z.string().catch(''),
});

export const ContactSectionSchema = z.object({
  id: z.number(),
  pageId: z.number().nullable().catch(null),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string().catch('ACTIVE'),
  data: z.object({
    address: z.string().nullable().catch(null),
    email: z.string().nullable().catch(null),
    supportHour: z.string().nullable().catch(null),
    mapLat: z.number().nullable().catch(null),
    mapLng: z.number().nullable().catch(null),
    supportPhone: z.string().nullable().catch(null),
    socials: z.array(ContactSocialSchema).catch([]),
  }),
});

export type ContactSocial = z.infer<typeof ContactSocialSchema>;
export type ContactSection = z.infer<typeof ContactSectionSchema>;

/** Payload for creating/updating the contact (upsert). */
export interface ContactInput {
  address?: string | null;
  email?: string | null;
  supportHour?: string | null;
  mapLat?: number | null;
  mapLng?: number | null;
}
