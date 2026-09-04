'use client';

import LottieAnimation from '@/components/global/LottieAnimation';

export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }

  return <LottieAnimation src='/animations/500.json' />;
}
