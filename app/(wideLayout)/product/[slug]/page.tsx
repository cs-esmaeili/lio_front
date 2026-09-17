import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import NewProductShopSection from '@/components/shop/single/NewProductShopSection';
import SimilarProductShopSection from '@/components/shop/single/SimilarProductShopSection';
import ImageGallery from '@/components/shop/single/ImageGallery';
import AddToCart from '@/components/shop/single/AddToCart';
import Attribute from '@/components/shop/single/Attribute';
import TabsClient from '@/components/shop/single/TabsClient';
import ProductBottomNavSetter from '@/components/shop/single/ProductBottomNavSetter';
// import AstelamCard from '@/components/global/Cards/AstelamCard';
import FavoriteButton from '@/components/shop/single/FavoriteButton';
import CompareButton from '@/components/shop/single/CompareButton';
import SharePopover from '@/components/shop/single/SharePopover';
import { productDetails, moreProductsSection, newProductsSection } from '@/services/singelProduct.service';
import useSeo from '@/hooks/seo/useSeo';
import productSchema from '@/schema/seo/product';
import JsonLd from '@/components/seo/JsonLd';
import { convertSlugToBarcode } from '@/services/singelProduct.service';
import { getFooterData } from '@/services/HeaderFooter.service';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import reviewSchema from '@/schema/seo/review';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: 'overview' | 'features' | 'reviews';
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const { barcode: id } = (await convertSlugToBarcode(slug)) as {
    barcode: string;
  };

  const productData = (await productDetails(id)).data;
  const { product } = productData;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${product.seo?.meta_title || product.title} | ${siteName}`,

    description:
      product.seo?.meta_description ||
      product.short_description
        ?.replace(/<[^>]+>/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim(),

    keywords: product.seo?.keywords,
    canonical: product.seo?.canonical ?? `${siteUrl}/product/${slug}/`,
    robots: product.seo?.robot,
    image: product.image,
    imageAlt: product.title,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;

  const { barcode: id } = (await convertSlugToBarcode(slug)) as {
    barcode: string;
  };

  const footer = await getFooterData();

  const callToAction = footer.support_phone || footer.telephone || '';

  const socialToAction = footer.communications || [];

  const currentTab = tab || 'overview';

  const productData = (await productDetails(id)).data;

  const moreProductsData = await moreProductsSection(id);

  const newProductsData = await newProductsSection();

  const { product, attribute_groups, tags, labels, communications, base_attributes, prices, default_variant } = productData;

  const breadcrumbItems = product.breadcrumb || [];

  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const { more_images, image, categories, short_description } = product;

  const categoryId = categories?.[0]?.id ? String(categories[0].id) : '';

  const url = `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/product/${slug}/`;

  // const roundedDiscount = Math.round(default_variant?.discount_percent || 0);


  const productJsonLd = productSchema({
    name: product.title,
    description:
      product.seo?.meta_description ??
      product.short_description
        ?.replace(/<[^>]+>/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim(),
    image: product.image,
    url,
    sku: product.barcode,
    brand: product.brand?.title,
    price: prices?.[0]?.final_amount ?? product.default_variant?.final_amount,
    availability: product.default_variant?.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    ratingValue: product.rating,
    reviewCount: product.rating_value,
    review: reviewSchema({ comments: communications?.data?.comments }),
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <ProductBottomNavSetter baseAttributes={base_attributes} prices={prices} product={product} />
      <div className='flex flex-col flex-1 items-center justify-center gap-7.5 xl:gap-12.5 mb-10'>
        <section className='container-shop'>
          <div className='flex flex-col gap-[24px] mb-[32px]'> <BreadCrumpGenerator items={breadcrumbItems} /> </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-[24px]'>
            <div className='lg:col-span-4 relative'>
              <ImageGallery images={[{ id: 1, src: image, alt: 'نمایش ۱ محصول' }, ...more_images]} />
              <div className='flex items-center gap-2 px-0 py-2 md:px-2 absolute -bottom-19 left-0 md:top-2 md:right-2 md:left-auto md:bottom-auto z-10 md:bg-primary-4/70 rounded-lg'>
                <FavoriteButton barcode={product.barcode} productId={product.id} />
                <CompareButton productId={id} productCategory={categoryId} />
                <SharePopover url={url} />
              </div>
            </div>

            <div className='lg:col-span-8'>
              <div className='grid grid-cols-1 md:grid-cols-12 gap-[24px]'>
                <div className='md:col-span-6 xl:col-span-8'>
                  <Attribute tags={tags} commentsNumber={communications.links.comments.total} product={product} attributeGroups={attribute_groups} />
                </div>
                <div className='md:col-span-6 xl:col-span-4'>
                  <div className='sticky top-5 flex flex-col gap-3' id='addToCart'>
                    {/* { roundedDiscount > 0 && (
                <div className='flex gap-1 shrink-0'>
                  <div
                    className="bg-gray-3 text-secondary-black-3 w-7 h-7 sm:w-8 md:w-9 sm:h-8 md:h-9
                    text-[10px] sm:text-xs md:text-[14px] flex justify-center items-center rounded-[9px]
                    hover:rounded-[50px] transition-all duration-500 ease-in-out cursor-pointer"
                  >
                    {roundedDiscount}%
                  </div>
                </div>
              )} */}

                    <AddToCart
                      baseAttributes={base_attributes}
                      prices={prices}
                      product={product}
                      showProductInfo={false}
                      callToAction={callToAction}
                      socialToAction={socialToAction}
                    />
                    {/* <AstelamCard /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SimilarProductShopSection section={moreProductsData} />

        <section className='container-shop'>
          <div className='grid grid-cols-1 xl:grid-cols-12 xl:gap-[88px] h-full'>
            <div className='xl:col-span-9'>
              <TabsClient
                product={product}
                attributeGroups={attribute_groups}
                initialTab={currentTab as 'overview' | 'features' | 'reviews'}
                shortDescription={short_description}
                barcode={id}
                communications={{
                  comments: communications?.data?.comments,
                  questions: communications?.data?.questions,
                }}
              />
            </div>
            <div className='hidden xl:block xl:col-span-3'>
              <div className='sticky top-5'>
                <AddToCart
                  baseAttributes={base_attributes}
                  prices={prices}
                  product={product}
                  showProductInfo={true}
                  productImage={image}
                  productName={product.title}
                  callToAction={callToAction}
                  socialToAction={socialToAction}
                />
              </div>
            </div>
          </div>
        </section>

        <NewProductShopSection section={newProductsData} btnlink='/shop' />
      </div>
    </>
  );
}
