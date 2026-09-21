import { notFound } from 'next/navigation';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import NewProductShopSection from '@/components/shop/single/NewProductShopSection';
import SimilarProductShopSection from '@/components/shop/single/SimilarProductShopSection';
import ImageGallery from '@/components/shop/single/ImageGallery';
import AddToCart from '@/components/shop/single/AddToCart';
import Attribute from '@/components/shop/single/Attribute';
import TabsClient from '@/components/shop/single/TabsClient';
import ProductBottomNavSetter from '@/components/shop/single/ProductBottomNavSetter';
// import FavoriteButton from '@/components/shop/single/FavoriteButton';
// import CompareButton from '@/components/shop/single/CompareButton';
import SharePopover from '@/components/shop/single/SharePopover';
import { getProductDetails } from '@/services/singelProduct.service';
import type { ProductDetails } from '@/typescript/schemas/products/product-details.schema';
import useSeo from '@/hooks/seo/useSeo';
import productSchema from '@/schema/seo/product';
import JsonLd from '@/components/seo/JsonLd';
import { getFooterData } from '@/services/HeaderFooter.service';
import breadcrumbSchema from '@/schema/seo/breadcrumb';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: 'overview' | 'features';
  }>;
};

const stripHtml = (value: string | null | undefined) =>
  value
    ?.replace(/<[^>]+>/g, ' ')
    ?.replace(/\s+/g, ' ')
    ?.trim();

const loadProduct = async (slug: string): Promise<ProductDetails | null> => {
  try {
    return await getProductDetails(slug);
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const details = await loadProduct(slug);

  if (!details) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- useSeo is a pure Metadata builder, not a hook
    return useSeo({});
  }

  const { product } = details;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  // eslint-disable-next-line react-hooks/rules-of-hooks -- useSeo is a pure Metadata builder, not a hook
  return useSeo({
    title: `${product.name} | ${siteName}`,
    description: stripHtml(product.description),
    canonical: `${siteUrl}/product/${slug}/`,
    image: product.images[0]?.url ?? undefined,
    imageAlt: product.name,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;

  const details = await loadProduct(slug);

  if (!details) {
    notFound();
  }

  const { product, baseAttributes, attributeGroups, variants, sections } = details;

  const footer = await getFooterData();

  const callToAction = footer.support_phone || footer.telephone || '';

  const socialToAction = footer.communications || [];

  const currentTab = tab === 'features' ? 'features' : 'overview';

  const breadcrumbItems = [
    { id: 0, title: 'خانه', href: '/', disabled: false },
    ...product.categories.map((category) => ({
      id: category.id,
      title: category.name,
      href: `/product-category/${category.slug}`,
      disabled: false,
    })),
    { id: product.id, title: product.name, href: undefined, disabled: true },
  ];

  const breadcrumbJsonLd = breadcrumbSchema(
    breadcrumbItems.map((item) => ({ title: item.title, href: item.href })),
  );

  const primaryImage = product.images[0]?.url ?? undefined;

  const url = `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/product/${slug}/`;

  const productJsonLd = productSchema({
    name: product.name,
    description: stripHtml(product.description),
    image: primaryImage,
    url,
    sku: product.defaultVariant?.sku ?? undefined,
    price: product.defaultVariant?.price ?? variants[0]?.price,
    availability: product.defaultVariant?.isAvailable
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  });

  const galleryImages = product.images.flatMap((image) =>
    image.url ? [{ id: image.id, src: image.url, alt: product.name }] : [],
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <ProductBottomNavSetter product={product} />
      <div className='flex flex-col flex-1 items-center justify-center gap-7.5 xl:gap-12.5 mb-10'>
        <section className='container-shop'>
          <div className='flex flex-col gap-[24px] mb-[32px]'>
            <BreadCrumpGenerator items={breadcrumbItems} />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-[24px]'>
            <div className='lg:col-span-4 relative'>
              <ImageGallery images={galleryImages} />
              <div className='flex items-center gap-2 px-0 py-2 md:px-2 absolute -bottom-19 left-0 md:top-2 md:right-2 md:left-auto md:bottom-auto z-10 md:bg-primary-4/70 rounded-lg'>
                {/* <FavoriteButton productId={product.id} /> */}
                {/* <CompareButton productId={String(product.id)} productCategory={categoryId} /> */}
                <SharePopover url={url} />
              </div>
            </div>

            <div className='lg:col-span-8'>
              <div className='grid grid-cols-1 md:grid-cols-12 gap-[24px]'>
                <div className='md:col-span-6 xl:col-span-8'>
                  <Attribute product={product} attributeGroups={attributeGroups} />
                </div>
                <div className='md:col-span-6 xl:col-span-4'>
                  <div className='sticky top-5 flex flex-col gap-3' id='addToCart'>
                    <AddToCart
                      baseAttributes={baseAttributes}
                      variants={variants}
                      product={product}
                      showProductInfo={false}
                      callToAction={callToAction}
                      socialToAction={socialToAction}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SimilarProductShopSection products={sections.similar} />

        <section className='container-shop'>
          <div className='grid grid-cols-1 xl:grid-cols-12 xl:gap-[88px] h-full'>
            <div className='xl:col-span-9'>
              <TabsClient product={product} attributeGroups={attributeGroups} initialTab={currentTab} />
            </div>
            <div className='hidden xl:block xl:col-span-3'>
              <div className='sticky top-5'>
                <AddToCart
                  baseAttributes={baseAttributes}
                  variants={variants}
                  product={product}
                  showProductInfo={true}
                  productImage={primaryImage}
                  productName={product.name}
                  callToAction={callToAction}
                  socialToAction={socialToAction}
                />
              </div>
            </div>
          </div>
        </section>

        <NewProductShopSection section={{ products: sections.newProducts }} btnlink='/shop' />
      </div>
    </>
  );
}
