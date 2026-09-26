'use client';

import { useState } from 'react';
import { CommentReply } from '@/components/shop/single/tabs/comments/CommentReply';
import type { Comment } from '@/components/shop/single/tabs/comments/CommentsSection';
import { useReactToComment } from '@/hooks/shop/useReactToComment';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/shadcn/button';
import avatar1 from '@/public/avatars/avatar1.jpg';
import Image from 'next/image';

type Props = {
  comment: Comment;
  barcode: string;
  onRefresh: () => void;
};

export function CommentItem({ comment, barcode, onRefresh }: Props) {
  const { isLoggedIn } = useAuth();
  const [openReply, setOpenReply] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes || 0);
  const [localDislikes, setLocalDislikes] = useState(comment.dislikes || 0);
  const [localReaction, setLocalReaction] = useState<'like' | 'dislike' | false>(comment.userReaction || false);

  const { reactToComment } = useReactToComment();

  const handleReaction = async (type: 'like' | 'dislike') => {
    const commentId = Number(comment.id);
    if (isNaN(commentId)) return;

    // Optimistic update
    if (type === 'like') {
      if (localReaction === 'like') {
        setLocalLikes((p) => Math.max(0, p - 1));
        setLocalReaction(false);
      } else {
        if (localReaction === 'dislike') setLocalDislikes((p) => Math.max(0, p - 1));
        setLocalLikes((p) => p + 1);
        setLocalReaction('like');
      }
    } else {
      if (localReaction === 'dislike') {
        setLocalDislikes((p) => Math.max(0, p - 1));
        setLocalReaction(false);
      } else {
        if (localReaction === 'like') setLocalLikes((p) => Math.max(0, p - 1));
        setLocalDislikes((p) => p + 1);
        setLocalReaction('dislike');
      }
    }

    await reactToComment(commentId, type);
  };

  const depthMargin = comment.depth && comment.depth > 0 ? { marginRight: `${Math.min(comment.depth, 3) * 24}px` } : undefined;

  return (
    <div className=' p-4 rounded-lg space-y-3' style={depthMargin}>
      <div className='flex  justify-between '>
        <div className='flex gap-2'>
          <Image src={avatar1} alt='logo' className='rounded-full overflow-hidden' width={48} height={48} />
          <div className='flex flex-col h-full justify-between '>
            <div className='font-semibold'>{comment.author}</div>
            {typeof comment.rating === 'number' && (
              <div className='flex gap-1'>
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;

                  return (
                    <span key={i} className={starValue <= (comment.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col justify-between'>
          <div className='text-xs text-gray-400'>{comment.date}</div>
          {isLoggedIn && (
            <div className='flex items-center gap-3 text-sm text-gray-500'>
              <button
                type='button'
                onClick={() => handleReaction('dislike')}
                className={`flex items-center gap-1 transition ${localReaction === 'dislike' ? 'text-red-500' : 'hover:text-red-500'}`}>
                <svg
                  className='w-4 h-4 rotate-180'
                  fill={localReaction === 'dislike' ? 'currentColor' : 'none'}
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'
                  />
                </svg>
                <span>{localDislikes}</span>
              </button>
              <button
                type='button'
                onClick={() => handleReaction('like')}
                className={`flex items-center gap-1 transition ${localReaction === 'like' ? 'text-primary-1' : 'hover:text-primary-1'}`}>
                <svg className='w-4 h-4' fill={localReaction === 'like' ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'
                  />
                </svg>
                <span>{localLikes}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <p className='text-gray-700 leading-relaxed'>{comment.comment}</p>

      {isLoggedIn && (!comment.depth || comment.depth === 0) && (
        <Button type='submit' className='rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white' onClick={() => setOpenReply((p) => !p)}>
          {openReply ? 'لغو پاسخ' : 'پاسخ'}
        </Button>
      )}

      <div className='border-b-2 border-dashed '></div>

      {openReply && <CommentReply parentId={comment.id} barcode={barcode} onSubmitSuccess={onRefresh} onClose={() => setOpenReply(false)} />}

      {comment.replies?.length ? (
        <div className='space-y-3 mt-3'>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} barcode={barcode} onRefresh={onRefresh} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
