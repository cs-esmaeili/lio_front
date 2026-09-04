import Image from 'next/image';
import ShareBox from '@/components/article/ShareBox';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import MagCardHorizontal from '@/components/global/Cards/MagCardHorizontal';
import Gradient from '@/components/global/Gradient';
import { singlePost } from '@/services/blog.service';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import articleSchema from '@/schema/seo/article';
import breadcrumbSchema from '@/schema/seo/breadcrumb';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const pageInfo = (await singlePost(slug)).data.data;
  const { post } = pageInfo;

  const description =
    post.seo?.meta_description ||
    post.sub_description
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${post.seo?.meta_title || post.title} | ${siteName}`,
    description,
    keywords: post.seo?.keywords,
    canonical: post.seo?.canonical ?? `${siteUrl}/blog/${slug}/`,
    robots: post.seo?.robot,
    image: post.image_path,
    imageAlt: post.title,
    author: post.writer,
    type: 'article',
  });
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const pageInfo = (await singlePost(slug)).data.data;

  const { post, like_services } = pageInfo;

  const breadcrumbItems = post.breadcrumb || [];

  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);


  const description =
    post.seo?.meta_description ||
    post.sub_description
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim();


  const articleJsonLd = articleSchema({
    title: post.title,
    description,
    image: post.image_path,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/blog/${post.slug}/`,
    author: post.writer,
    publishedTime: post.published,
    modifiedTime: post.updated,
  });

  const url = `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/blog/${post.slug}/`;

  const relatedArticles = like_services;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <Gradient />
      <section className='container'>
        <div className='flex flex-col gap-[24px] mb-[32px]'> <BreadCrumpGenerator items={breadcrumbItems} /> </div>

        <div className='flex flex-col md:grid md:grid-cols-12 gap-[24px] mb-20'>
          <div className='flex flex-col gap-4 md:col-span-3 md:sticky md:top-5 self-start order-1'>
            <Image className='rounded-lg object-cover w-full h-full' src={post.image_path} alt={post.title} width={318} height={200} />
            <div className='flex flex-row md:flex-col lg:flex-row items-center justify-between gap-1 my-4 py-4 border-t border-b border-primary-3'>
              <span className='text-secondary-2 text-sm'>این مطلب را به اشتراک بگذارید:</span>
              <ShareBox url={url} title={post.title} />
            </div>

            {relatedArticles && relatedArticles.length > 0 && (
              <div className='hidden md:block'>
                <h5 className='mb-2 text-secondary-1'>مقالات مرتبط</h5>
                <div className='grid grid-cols-1'>
                  {relatedArticles.map((article: any) => (
                    <MagCardHorizontal
                      key={article.code}
                      href={`/blog/${article.slug}`}
                      imageSrc={article.image_path}
                      imageAlt={article.title}
                      title={article.title}
                      excerpt={article.sub_description}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='col-span-12 md:col-span-9 box-content order-2'>
            <h1 className='mb-5'>{post.title}</h1>
            <div
              className='flex flex-col gap-4 font-light text-secondary-1 text-justify box-description text-body'
              dangerouslySetInnerHTML={{ __html: post.description }}
              suppressHydrationWarning
            />
          </div>

          {relatedArticles && relatedArticles.length > 0 && (
            <div className='block md:hidden order-3'>
              <h5 className='mb-2 text-secondary-1'>مقالات مرتبط</h5>
              <div className='grid grid-cols-1'>
                {relatedArticles.map((article: any) => (
                  <MagCardHorizontal
                    key={article.code}
                    href={`/blog/${article.slug}`}
                    imageSrc={article.image_path}
                    imageAlt={article.title}
                    title={article.title}
                    excerpt={article.sub_description}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
