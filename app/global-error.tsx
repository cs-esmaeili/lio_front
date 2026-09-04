'use client';

import LottieAnimation from '@/components/global/LottieAnimation';

export default function GlobalErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }

  return (
    <html>
      <body>
        <LottieAnimation src='/animations/500.json' />
      </body>
    </html>
  );
}
