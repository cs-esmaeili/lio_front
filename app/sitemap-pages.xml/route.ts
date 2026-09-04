import { isSeoEnabled } from '@/lib/seo';
import { fetcher } from '@/services/core/SSRService';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_ENDPOINT ?? '').replace(/\/$/, '');
const API_URL = process.env.BACKEND_ENDPOINT_SSR;

interface SitemapItem {
  title: string;
  updated_at: string;
  image: string;
  url: string;
}

interface SitemapApiResponse {
  status: string;
  data: { pages: SitemapItem[] };
}

function buildUrlsetXml(items: { url: string; lastmod: string }[]): string {
  if (!items.length) {
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }
  const urls = items
    .map(
      (i) => `  <url>
    <loc>${i.url}</loc>
    <lastmod>${i.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET(): Promise<Response> {
  if (!isSeoEnabled() || !SITE_URL || !API_URL) {
    return new Response(buildUrlsetXml([]), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  try {
    const res = await fetcher<SitemapApiResponse>(`${API_URL}/sitemap`, {
      next: { revalidate: 3600 },
    });

    const items = (res?.data?.pages ?? []).map((p) => ({
      url: p.url,
      lastmod: new Date(p.updated_at).toISOString(),
    }));

    return new Response(buildUrlsetXml(items), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch {
    return new Response(buildUrlsetXml([]), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}
