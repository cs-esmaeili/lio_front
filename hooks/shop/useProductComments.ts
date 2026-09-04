'use client';

import { useState, useCallback, useEffect } from 'react';
import { getProductCommunicationsCSR } from '@/services/singelProduct.service';
import type { CommentApiResponse, AnswerApiResponse, PaginationLinks } from '@/services/singelProduct.service';

type UseProductCommentsReturn = {
  comments: CommentApiResponse[];
  questions: AnswerApiResponse[];
  commentsLinks: PaginationLinks | null;
  questionsLinks: PaginationLinks | null;
  loading: boolean;
  loadPage: (page: number) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useProductComments(
  barcode: string,
  initialComments?: CommentApiResponse[],
  initialQuestions?: AnswerApiResponse[],
): UseProductCommentsReturn {
  const [comments, setComments] = useState<CommentApiResponse[]>(initialComments || []);
  const [questions, setQuestions] = useState<AnswerApiResponse[]>(initialQuestions || []);
  const [commentsLinks, setCommentsLinks] = useState<PaginationLinks | null>(null);
  const [questionsLinks, setQuestionsLinks] = useState<PaginationLinks | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchPage = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const res = await getProductCommunicationsCSR(barcode, page);
        const body = res.data;
        setComments(body.data?.comments || []);
        setQuestions(body.data?.questions || []);
        setCommentsLinks(body.links?.comments || null);
        setQuestionsLinks(body.links?.questions || null);
      } catch {
        // errors handled by interceptor
      } finally {
        setLoading(false);
      }
    },
    [barcode],
  );

  const refresh = useCallback(async () => {
    await fetchPage(commentsLinks?.current_page || 1);
  }, [fetchPage, commentsLinks]);

  // Auto-fetch page 1 on mount (SSR data may not include full comments)
  useEffect(() => {
    if (fetched) return;
    setFetched(true);
    fetchPage(1);
  }, [fetched, fetchPage]);

  return {
    comments,
    questions,
    commentsLinks,
    questionsLinks,
    loading,
    loadPage: fetchPage,
    refresh,
  };
}
