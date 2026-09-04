type CommentType = {
  id: number | string;
  user_name?: string;
  comment?: string;
  rate?: number;
};

type ReviewSchemaProps = {
  comments?: CommentType[];
  bestRating?: number;
  worstRating?: number;
};

export default function reviewSchema({
  comments,
  bestRating = 5,
  worstRating = 1,
}: ReviewSchemaProps) {
  if (!comments || comments.length === 0) return undefined;

  const reviews = comments
    .filter((c) => c.comment && c.comment.trim().length > 0)
    .map((c) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: c.user_name?.trim() || "کاربر ناشناس",
      },
      reviewBody: c
        .comment!.replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
      reviewRating: {
        "@type": "Rating",
        ratingValue: c.rate ?? bestRating,
        bestRating,
        worstRating,
      },
    }));

  return reviews.length > 0 ? reviews : undefined;
}