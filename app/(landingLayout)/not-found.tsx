'use client';

export default function NotFound() {
  // Dev mode: render default Next.js-style 404 (no custom UI).
  // There is no "re-throw" for not-found — it's not an error boundary.
  if (process.env.NODE_ENV === 'development') {
    return (
      <html dir="ltr" lang="en">
        <body>
          <div className="flex justify-center items-center min-h-screen bg-white font-sans">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
              <p className="text-lg text-gray-500">
                This page could not be found.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html dir="rtl" lang="fa">
      <body>
        <div className="flex flex-col justify-center items-center min-h-screen bg-white p-5">
          <img
            src="/errors/404.gif"
            alt="404 - صفحه پیدا نشد"
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
