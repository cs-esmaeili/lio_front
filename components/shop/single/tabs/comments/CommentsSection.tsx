'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommentForm } from '@/components/shop/single/tabs/comments/CommentForm';
import { useProductComments } from '@/hooks/shop/useProductComments';
import { useAuth } from '@/hooks/useAuth';
import type { CommentApiResponse, AnswerApiResponse } from '@/services/singelProduct.service';
import { CommentItem } from '@/components/shop/single/tabs/comments/CommentItem';

export type Comment = {
  id: string;
  author: string;
  comment: string;
  date: string;
  rating?: number;
  replies?: Comment[];
  likes?: number;
  dislikes?: number;
  userReaction?: 'like' | 'dislike' | false;
  /** depth level for nesting margin (0 = top-level) */
  depth?: number;
};

type Props = {
  barcode: string;
  initialComments?: CommentApiResponse[];
  initialQuestions?: AnswerApiResponse[];
};

function mapApiCommentToUI(c: CommentApiResponse, depth = 0): Comment {
  return {
    id: String(c.id),
    author: c.user_name,
    comment: c.comment,
    date: c.created_at,
    rating: c.rate,
    replies: (c.replies || []).map((r) => mapApiCommentToUI(r, depth + 1)),
    likes: c.likes,
    dislikes: c.dislikes,
    userReaction: c.user_reaction,
    depth,
  };
}

function mapApiQuestionToUI(q: AnswerApiResponse): Comment {
  return {
    id: `q-${q.id}`,
    author: q.creator.name,
    comment: q.title,
    date: q.created_at,
    rating: undefined,
    replies: (q.answers || []).map((a) => ({
      id: `a-${a.id}`,
      author: a.creator.name,
      comment: a.title,
      date: a.created_at,
      rating: undefined,
      replies: [],
      depth: 1,
    })),
    depth: 0,
  };
}

/** Build tree: nest replies under their parent comments */
function buildCommentTree(flatComments: CommentApiResponse[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const roots: Comment[] = [];

  // First pass: create UI comments for all
  for (const c of flatComments) {
    commentMap.set(c.id, mapApiCommentToUI(c));
  }

  // Second pass: nest replies under parents
  for (const c of flatComments) {
    const ui = commentMap.get(c.id)!;
    if (c.parent_id && commentMap.has(c.parent_id)) {
      const parent = commentMap.get(c.parent_id)!;
      ui.depth = (parent.depth || 0) + 1;
      parent.replies = [...(parent.replies || []), ui];
    } else {
      roots.push(ui);
    }
  }

  return roots;
}

export function CommentsSection({ barcode, initialComments = [], initialQuestions = [] }: Props) {
  const { isHydrated, isLoggedIn } = useAuth();
  const { comments, questions, commentsLinks, loading, loadPage, refresh } = useProductComments(barcode, initialComments, initialQuestions);

  const [tree, setTree] = useState<Comment[]>([]);
  const [returnUrl, setReturnUrl] = useState('');

  useEffect(() => {
    setReturnUrl(window.location.pathname + window.location.search);
  }, []);

  // Build display tree from API data — group replies under parents
  useEffect(() => {
    const uiComments = buildCommentTree(comments);
    const uiQuestions = questions.map(mapApiQuestionToUI);
    setTree([...uiComments, ...uiQuestions]);
  }, [comments, questions]);

  const handleCommentSubmitted = () => {
    refresh();
  };

  // Auth not yet determined — don't flash wrong state
  if (!isHydrated) {
    return (
      <div className='space-y-8'>
        <div className='text-center text-gray-400 py-8'>در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Comment form — gated for auth */}
      <div className='relative'>
        <div className={isLoggedIn ? '' : 'blur-sm select-none pointer-events-none'}>
          <CommentForm barcode={barcode} onSubmitSuccess={handleCommentSubmitted} />
        </div>

        {!isLoggedIn && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 z-10'>
            <div className='absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg' />
            <div className='relative text-center bg-white rounded-xl p-6 shadow-lg max-w-sm mx-4'>
              <div className='text-lg font-semibold text-secondary-1 mb-2'>برای ثبت نظر وارد شوید</div>
              <p className='text-sm text-gray-500 mb-6'>برای ثبت نظر و امتیازدهی به محصولات، نیاز به ورود به حساب کاربری دارید.</p>
              <Link
                href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
                className='inline-block rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white px-8 py-3 text-sm font-medium transition'>
                ورود به حساب کاربری
              </Link>
            </div>
          </div>
        )}
      </div>

      {loading && <div className='text-center text-gray-400 py-4'>در حال بارگذاری...</div>}

      {tree.map((comment) => (
          <CommentItem key={comment.id} comment={comment} barcode={barcode} onRefresh={handleCommentSubmitted} />
        ))}

      {commentsLinks && commentsLinks.current_page < commentsLinks.last_page && (
        <div className='text-center'>
          <button
            onClick={() => loadPage(commentsLinks.current_page + 1)}
            disabled={loading}
            className='text-primary-1 hover:text-primary-black-1 text-sm font-medium disabled:opacity-50'>
            مشاهده بیشتر
          </button>
        </div>
      )}
    </div>
  );
}
