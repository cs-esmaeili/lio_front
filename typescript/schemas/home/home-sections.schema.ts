import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Shared media                                                              */
/* -------------------------------------------------------------------------- */

export const HomeSlideSchema = z.object({
  id: z.number(),
  desktopFileUrl: z.string().nullable().catch(null),
  tabletFileUrl: z.string().nullable().catch(null),
  mobileFileUrl: z.string().nullable().catch(null),
  url: z.string().nullable().catch(null),
});

export const HomeBannerSchema = z.object({
  id: z.number(),
  sortOrder: z.number().catch(0),
  title: z.string().nullable().catch(null),
  subtitle: z.string().nullable().catch(null),
  buttonTitle: z.string().nullable().catch(null),
  buttonUrl: z.string().nullable().catch(null),
  desktopFileUrl: z.string().nullable().catch(null),
  tabletFileUrl: z.string().nullable().catch(null),
  mobileFileUrl: z.string().nullable().catch(null),
});

export const HomeIntroductionTitlesSchema = z.object({
  cta: z.string().nullable().catch(null),
  title: z.string().nullable().catch(null),
  eyebrow: z.string().nullable().catch(null),
  subtitle: z.string().nullable().catch(null),
  highlight: z.string().nullable().catch(null),
  description: z.string().nullable().catch(null),
});

/* -------------------------------------------------------------------------- */
/*  Products                                                                  */
/* -------------------------------------------------------------------------- */

export const HomeProductImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  isPrimary: z.boolean().catch(false),
  isThumbnail: z.boolean().catch(false),
  sortOrder: z.number().catch(0),
});

const RawProductVariantSchema = z.object({
  id: z.number(),
  sku: z.string().nullable().catch(null),
  price: z.number().nullable().catch(null),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().nullable().catch(0),
});

const RawHomeProductSchema = z.object({
  id: z.number(),
  sortOrder: z.number().catch(0),
  productId: z.number(),
  productName: z.string(),
  productSlug: z.string(),
  images: z.array(HomeProductImageSchema).catch([]),
  defaultVariant: RawProductVariantSchema.nullable().catch(null),
});

/**
 * The home API returns variants as `defaultVariant` with `price` / `compareAtPrice`
 * / `stock`. `ProductCard` renders the legacy variant contract (`default_variant`
 * with `final_amount` / `amount` / `discount_percent`), so normalise here.
 */
export const HomeProductSchema = RawHomeProductSchema.transform((product) => {
  const variant = product.defaultVariant;
  const price = variant?.price ?? 0;
  const compareAtPrice = variant?.compareAtPrice ?? price;
  const stock = variant?.stock ?? 0;

  const discountPercent =
    compareAtPrice > price && compareAtPrice > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return {
    id: product.id,
    productId: product.productId,
    productName: product.productName,
    productSlug: product.productSlug,
    images: product.images,
    default_variant: {
      id: variant?.id ?? 0,
      amount: compareAtPrice,
      final_amount: price,
      discount_percent: discountPercent,
      is_available: stock > 0,
      zero_price: price > 0 ? '' : 'call',
    },
  };
});

/* -------------------------------------------------------------------------- */
/*  Sections                                                                  */
/* -------------------------------------------------------------------------- */

export type HomeSlide = z.infer<typeof HomeSlideSchema>;
export type HomeBanner = z.infer<typeof HomeBannerSchema>;
export type HomeIntroductionTitles = z.infer<typeof HomeIntroductionTitlesSchema>;
export type HomeProduct = z.infer<typeof HomeProductSchema>;

export interface HomeSliderSectionData {
  slides: HomeSlide[];
}
export interface HomeProductListSectionData {
  products: HomeProduct[];
}
export interface HomeBannerSectionData {
  banners: HomeBanner[];
}
export interface HomeIntroductionSectionData {
  titles: HomeIntroductionTitles | null;
  desktopFileUrl: string | null;
  tabletFileUrl: string | null;
  mobileFileUrl: string | null;
}

export type HomeSectionData =
  | HomeSliderSectionData
  | HomeProductListSectionData
  | HomeBannerSectionData
  | HomeIntroductionSectionData
  | Record<string, unknown>;

export interface HomeSection {
  id: number;
  pageId: number;
  type: string;
  location: string;
  title: string | null;
  link: string | null;
  sortOrder: number;
  status: string;
  data: HomeSectionData;
}

const parseArray = <T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T>[] =>
  z.array(schema).catch([]).parse(value);

const parseSlides = (data: Record<string, unknown>): HomeSlide[] => parseArray(HomeSlideSchema, data.slides);
const parseBanners = (data: Record<string, unknown>): HomeBanner[] => parseArray(HomeBannerSchema, data.banners);
const parseProducts = (data: Record<string, unknown>): HomeProduct[] => parseArray(HomeProductSchema, data.products);

const RawSectionSchema = z.object({
  id: z.number(),
  pageId: z.number(),
  type: z.string(),
  location: z.string(),
  title: z.string().nullable().catch(null),
  link: z.string().nullable().catch(null),
  sortOrder: z.number().catch(0),
  status: z.string(),
  data: z.record(z.string(), z.unknown()).catch({}),
});

export const HomeSectionSchema = RawSectionSchema.transform((section): HomeSection => {
  const base = {
    id: section.id,
    pageId: section.pageId,
    type: section.type,
    location: section.location,
    title: section.title,
    link: section.link,
    sortOrder: section.sortOrder,
    status: section.status,
  };

  switch (section.location) {
    case 'SLIDER':
      return { ...base, data: { slides: parseSlides(section.data) } };
    case 'AMAZING_PRODUCTS':
    case 'PRODUCT_LIST':
      return { ...base, data: { products: parseProducts(section.data) } };
    case 'BANNER_4':
    case 'BANNER_3':
      return { ...base, data: { banners: parseBanners(section.data) } };
    case 'INTRODUCTION':
      return {
        ...base,
        data: {
          titles: HomeIntroductionTitlesSchema.nullable().catch(null).parse(section.data.titles),
          desktopFileUrl: z.string().nullable().catch(null).parse(section.data.desktopFileUrl),
          tabletFileUrl: z.string().nullable().catch(null).parse(section.data.tabletFileUrl),
          mobileFileUrl: z.string().nullable().catch(null).parse(section.data.mobileFileUrl),
        },
      };
    default:
      return { ...base, data: section.data };
  }
});

export const HomePageSectionsSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      page: z.object({
        id: z.number(),
        entityType: z.string(),
        entityId: z.number().nullable().catch(null),
        slug: z.string(),
      }),
      sections: z.array(HomeSectionSchema).default([]),
    }),
    message: z.string().optional(),
  })
  .transform((response) => response.data);

export type HomePageSections = z.infer<typeof HomePageSectionsSchema>;
