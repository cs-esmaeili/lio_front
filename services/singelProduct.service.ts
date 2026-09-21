import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { ProductDetailsSchema } from '@/typescript/schemas/products/product-details.schema';
import type { ProductDetails } from '@/typescript/schemas/products/product-details.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

// ==========================
// Types — Comments API
// ==========================

export type AddCommentPayload = {
  rate: number;
  title?: string;
  comment: string;
  suggestion: 0 | 1 | 2;
  advantages?: string[];
  disadvantages?: string[];
  parent_id?: number;
};

export type CommentApiResponse = {
  id: number;
  user_name: string;
  title: string;
  comment: string;
  rate: number;
  suggestion: 0 | 1 | 2;
  suggestion_text: string;
  advantages: string[];
  disadvantages: string[];
  likes: number;
  dislikes: number;
  created_at: string;
  user_reaction: 'like' | 'dislike' | false;
  user_creator: boolean;
  parent_id?: number;
  replies?: CommentApiResponse[];
};

export type AnswerApiResponse = {
  id: number;
  creator: { id: number; name: string };
  title: string;
  created_at: string;
  reactions: { likes: number; dislikes: number };
  user_reaction: 'like' | 'dislike' | false;
  answers: AnswerApiResponse[];
};

export type PaginationLinks = {
  self: string | null;
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export type CommunicationsResponse = {
  status: number;
  data: {
    comments: CommentApiResponse[];
    questions: AnswerApiResponse[];
  };
  links: {
    comments: PaginationLinks;
    questions: PaginationLinks;
  };
};

// ==========================
// SSR — server-side requests (Next.js server components)
// ==========================

// GET /products/{slug}/details

export const getProductDetails = async (slug: string): Promise<ProductDetails> => {
  const url = `${ssrPrefixUrl}/products/${encodeURIComponent(slug)}/details`;

  const data = await fetcher<unknown>(url, {
    next: {
      revalidate: 60,
    },
  });

  const parsed = ProductDetailsSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ جزئیات محصول نامعتبر است', parsed.error);
  }

  return parsed.data;
};

// ==========================
// CSR — client-side requests (Comments API)
// ==========================

// GET /api/product/{barcode}/communications
export const getProductCommunicationsCSR = (barcode: string, page?: number): Promise<AxiosResponse> => {
  const params = page ? `?page=${page}` : '';
  const url = `${csrPrefixUrl}/product/${barcode}/communications${params}`;
  return http.get(url);
};

// POST /api/profile/comments/{barcode}/submit
export const addCommentCSR = (barcode: string, payload: AddCommentPayload): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/comments/${barcode}/submit`;
  return http.post(url, payload);
};

// POST /api/profile/comments/{barcode}/remove
export const removeCommentCSR = (barcode: string, commentId: number): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/profile/comments/${barcode}/remove`;
  return http.post(url, { comment_id: commentId });
};

// POST /api/comments/{comment_id}/rate
export const reactToCommentCSR = (commentId: number, type: 'like' | 'dislike'): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/comments/${commentId}/rate`;
  return http.post(url, { type });
};

// POST /api/answers/{answer_id}/rate
export const reactToAnswerCSR = (answerId: number, type: 'like' | 'dislike'): Promise<AxiosResponse> => {
  const url = `${csrPrefixUrl}/answers/${answerId}/rate`;
  return http.post(url, { type });
};
