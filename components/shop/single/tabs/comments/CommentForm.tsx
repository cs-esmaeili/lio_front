"use client";

import { useState } from "react";
import type { Comment } from "@/components/shop/single/tabs/comments/CommentsSection";
import { useAddComment } from "@/hooks/shop/useAddComment";
import { toast } from "sonner";

import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";

type Props = {
  barcode: string;
  onSubmit?: (comment: Comment) => void;
  onSubmitSuccess?: () => void;
  parentId?: string;
  parentIdNum?: number;
  onClose?: () => void;
};

const SUGGESTION_OPTIONS = [
  { value: 1, label: "پیشنهاد می‌کنم" },
  { value: 2, label: "نظری ندارم" },
  { value: 0, label: "پیشنهاد نمی‌کنم" },
] as const;

export function CommentForm({ barcode, onSubmit, onSubmitSuccess, parentId, parentIdNum, onClose }: Props) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [suggestion, setSuggestion] = useState<0 | 1 | 2>(1);
  const [advantages, setAdvantages] = useState("");
  const [disadvantages, setDisadvantages] = useState("");

  const { addComment, loading } = useAddComment(barcode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text) return;

    const payload: Record<string, unknown> = {
      rate: rating || 3,
      comment: text,
      suggestion,
      advantages: advantages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      disadvantages: disadvantages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (name) payload.title = name;
    if (parentIdNum) payload.parent_id = parentIdNum;

    const result = await addComment(payload as any);

    if (result) {
      toast.success(parentId ? "پاسخ شما با موفقیت ثبت شد." : "نظر شما با موفقیت ثبت شد.");

      const newComment: Comment = {
        id: crypto.randomUUID(),
        author: name || "کاربر",
        comment: text,
        date: new Date().toLocaleDateString("fa-IR"),
        replies: [],
        rating: parentId ? undefined : rating,
        depth: parentId ? 1 : 0,
      };

      onSubmit?.(newComment);

      setName("");
      setText("");
      setRating(0);
      setSuggestion(1);
      setAdvantages("");
      setDisadvantages("");

      onSubmitSuccess?.();
    }

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg">


      {!parentId && (
        <>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(starValue)}
                  className={`text-2xl transition ${
                    starValue <= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {SUGGESTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSuggestion(opt.value)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  suggestion === opt.value
                    ? "bg-primary-1 text-white border-primary-1"
                    : "bg-white text-secondary-3 border-gray-300 hover:border-primary-1"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {!parentId && (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="عنوان نظر شما"
        />
      )}

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "پاسخ شما..." : "نظر شما..."}
      />

      {!parentId && (
        <>
          <Input
            value={advantages}
            onChange={(e) => setAdvantages(e.target.value)}
            placeholder="نقاط قوت (با کاما لاتین جدا کنید)"
          />

          <Input
            value={disadvantages}
            onChange={(e) => setDisadvantages(e.target.value)}
            placeholder="نقاط ضعف (با کاما لاتین جدا کنید)"
          />
        </>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white"
      >
        {loading ? "در حال ارسال..." : parentId ? "ارسال پاسخ" : "ارسال نظر"}
      </Button>
    </form>
  );
}