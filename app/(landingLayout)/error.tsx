'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // Dev mode: re-throw so Next.js native overlay handles it.
  // The error propagates to global-error.tsx, then to Next.js internals.
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }

  return (
    <html dir="rtl" lang="fa">
      <body>
        <div className="flex flex-col justify-center items-center min-h-screen bg-white p-5">
          <img
            src="/errors/500.gif"
            alt="500 - خطای سرور"
            className="max-w-full h-auto"
          />

          <div className="flex gap-4 mt-8">
            <a
              href="/"
              className="py-3 px-8 rounded-lg bg-purple-600 text-white font-medium transition-all hover:bg-purple-700 hover:scale-105 text-center"
            >
              صفحه اصلی
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              }}
              className="py-3 px-8 rounded-lg bg-gray-100 text-gray-700 font-medium transition-all hover:bg-gray-200 hover:scale-105 text-center border border-gray-200"
            >
              بازگشت به صفحه قبل
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
