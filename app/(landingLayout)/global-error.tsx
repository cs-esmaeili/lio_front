'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Dev mode: re-throw so Next.js native overlay handles it.
  // This is the last boundary before Next.js internals.
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }

  return (
    <html dir="rtl" lang="fa">
      <body>
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-5">
          <img
            src="/errors/500.gif"
            alt="500 - خطای سیستمی"
            className="max-w-full h-auto"
          />

          <h2 className="text-2xl text-white font-bold mt-6 mb-2">
            خطای سیستمی
          </h2>

          <p className="text-gray-300 text-sm mb-8">
            متأسفانه خطایی در سیستم رخ داده است. تیم فنی در حال رفع مشکل است.
          </p>

          <div className="flex gap-4">
            <a
              href="/"
              className="py-3 px-8 rounded-lg bg-purple-600 text-white font-medium transition-all hover:bg-purple-700 hover:scale-105 text-center"
            >
              صفحه اصلی
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="py-3 px-8 rounded-lg bg-gray-700 text-white font-medium transition-all hover:bg-gray-600 hover:scale-105 text-center border border-gray-600"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
