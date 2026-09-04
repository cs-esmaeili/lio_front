"use client";

import { useState, useCallback } from "react";
import { postListCSR } from "@/services/blog.service";

export function useArticles(initialOtherPosts: any[], initialLinks?: any) {
  const [otherPosts, setOtherPosts] = useState<any[]>(initialOtherPosts);
  const [currentPage, setCurrentPage] = useState(initialLinks?.current_page ?? 1);
  const [lastPage, setLastPage] = useState(initialLinks?.last_page ?? 1);
  const [loading, setLoading] = useState(false);

  const goToPage = useCallback(async (page: number) => {
    if (page === currentPage) return;

    // Page 1 already loaded via SSR — restore initial posts, no API call
    if (page === 1) {
      setOtherPosts(initialOtherPosts);
      setCurrentPage(1);
      setLastPage(initialLinks?.last_page ?? 1);
      return;
    }

    setLoading(true);
    try {
      const res = await postListCSR(page);
      const d = res.data.data;
      setOtherPosts(d.posts);
      setCurrentPage(d.links.current_page);
      setLastPage(d.links.last_page);
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialOtherPosts, initialLinks]);

  return {
    otherPosts,
    loading,
    pagination: { current_page: currentPage, last_page: lastPage },
    goToPage,
  };
}
