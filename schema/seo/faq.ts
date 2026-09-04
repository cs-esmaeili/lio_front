// schema/seo/faq.ts

type FaqQuestionType = {
  title: string;
  description: string;
};

export default function faqSchema(questions: FaqQuestionType[] = []) {
  if (!questions || questions.length === 0) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.title.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: q.description?.trim() || '',
      },
    })),
  };
}