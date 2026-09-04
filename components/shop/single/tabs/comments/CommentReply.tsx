'use client';

import { CommentForm } from '@/components/shop/single/tabs/comments/CommentForm';
import type { Comment } from '@/components/shop/single/tabs/comments/CommentsSection';

type Props = {
  parentId: string;
  barcode: string;
  onSubmitSuccess: () => void;
  onClose: () => void;
};

export function CommentReply({ parentId, barcode, onSubmitSuccess, onClose }: Props) {
  // Only pass numeric parent_id for actual comment replies (not questions/answers)
  const numericParentId = !parentId.startsWith('q-') && !parentId.startsWith('a-')
    ? Number(parentId)
    : undefined;

  return (
    <div className='mt-3'>
      <CommentForm
        barcode={barcode}
        parentId={parentId}
        parentIdNum={isNaN(numericParentId as number) ? undefined : numericParentId}
        onSubmitSuccess={onSubmitSuccess}
        onClose={onClose}
      />
    </div>
  );
}
