"use client";

import { useRef, useEffect } from "react";
import MagCardVertical from "@/components/global/Cards/MagCardVertical";
// import InlineSearch from "@/components/article/InlineSearch";
import { PaginationGenerator } from "@/components/global/PaginationGenerator";
import { Spinner } from "@/components/shadcn/spinner";
import { useArticles } from "@/hooks/useArticles";
import { normalizePagination } from "@/utils/pagination";

function mapPost(post: any) {
  return {
    id: post.code ?? post.slug,
    href: `/blog/${post.slug}`,
    imageSrc: post.image_path,
    imageAlt: post.title,
    title: post.title,
    date: `${post.published_month} ${post.published_day}`,
    excerpt: post.sub_description,
  };
}

export function MagClient({ firstFive, restPosts, links }: { firstFive: any[]; restPosts: any[]; links: any }) {

  const { otherPosts, loading, pagination, goToPage } = useArticles(restPosts, links);
  const paginationInfo = normalizePagination(pagination);
  const otherSectionRef = useRef<HTMLHeadingElement>(null);
  const prevPageRef = useRef(paginationInfo.page);

  useEffect(() => {
    if (paginationInfo.page !== prevPageRef.current) {
      prevPageRef.current = paginationInfo.page;
      setTimeout(() => {
        const el = otherSectionRef.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 200);
    }
  }, [otherPosts, paginationInfo.page]);

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const recentPosts = firstFive.slice(0, 4).map(mapPost);
  const featuredPost = firstFive[4] ? mapPost(firstFive[4]) : null;

  
  const otherMapped = otherPosts.map(mapPost);

  return (
    <>
      {/* <div className="grid grid-cols-12 gap-[24px] mb-[48px]">
        <div className="col-span-12 md:col-span-8" />
        <div className="col-span-12 md:col-span-4">
          <InlineSearch />
        </div>
      </div> */}

      <div className="mb-[48px]">
        <h2 className="mb-6 text-secondary-black-1 max-md:text-center">
          جدیدترین مطالب
        </h2>

        <div className="grid grid-cols-12 gap-[12px]">
          <div className="col-span-12 lg:col-span-6 max-sm:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
              {recentPosts.map((article: any) => (
                <MagCardVertical
                  key={article.id}
                  variant="vertical"
                  href={article.href}
                  imageSrc={article.imageSrc}
                  imageAlt={article.imageAlt}
                  title={article.title}
                  date={article.date}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 max-sm:order-1">
            <div className="grid grid-cols-1 h-full">
              {featuredPost && (
                <MagCardVertical
                  key={featuredPost.id}
                  variant="featured"
                  href={featuredPost.href}
                  imageSrc={featuredPost.imageSrc}
                  imageAlt={featuredPost.imageAlt}
                  title={featuredPost.title}
                  date={featuredPost.date}
                  excerpt={featuredPost.excerpt}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[420px]">
        <h2 ref={otherSectionRef} className="mb-6 text-secondary-black-1 max-md:text-center">
          سایر مطالب
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner className="size-8 text-primary-1" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherMapped.map((article: any) => (
              <MagCardVertical
                key={article.id}
                variant="vertical"
                href={article.href}
                imageSrc={article.imageSrc}
                imageAlt={article.imageAlt}
                title={article.title}
                date={article.date}
              />
            ))}
          </div>
        )}

        {paginationInfo.totalPages > 1 && (
          <div className="mt-8">
            <PaginationGenerator
              pagination={paginationInfo}
              onChange={handlePageChange}
              autoUpdateUrl={true}
            />
          </div>
        )}
      </div>
    </>
  );
}
