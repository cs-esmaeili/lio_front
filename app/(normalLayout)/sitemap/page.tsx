'use client';

import { useEffect, useState } from 'react';
import { sitemapCSR, getSitemapFileList, type SitemapFileMeta } from '@/services/sitemap.service';

export default function SitemapPage() {
  const [files, setFiles] = useState<SitemapFileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT ?? '';

    sitemapCSR()
      .then((data) => setFiles(getSitemapFileList(data, siteUrl)))
      .catch((err) => setError(err?.message || 'خطا در دریافت اطلاعات نقشه سایت'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-8 lg:py-12">
      <div className="page-title flex items-center justify-center w-full text-secondary-1 mb-8">
        <h1>نقشه سایت</h1>
      </div>

      {loading && (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-lg">
              <div className="h-5 bg-gray-200 rounded w-72" />
              <div className="h-5 bg-gray-200 rounded w-28" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary-1 text-white rounded-lg hover:bg-primary-1/90 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Sitemap</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.url} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener"
                      className="text-primary-1 hover:underline text-sm break-all"
                    >
                      {file.url}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap" dir="ltr">
                    {new Date(file.lastModified).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
