import { isSeoEnabled } from '@/lib/seo';
import { fetcher } from '@/services/core/SSRService';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_ENDPOINT ?? '').replace(/\/$/, '');
const API_URL = process.env.BACKEND_ENDPOINT_SSR;
const PER_PAGE = 2000;

interface SitemapItem {
  title: string;
  updated_at: string;
  image: string;
  url: string;
}

interface SitemapApiResponse {
  status: string;
  data: {
    pages: SitemapItem[];
    blog: SitemapItem[];
    categories: SitemapItem[];
    products: SitemapItem[];
  };
}

function maxDate(items: SitemapItem[]): string {
  if (!items.length) return new Date().toISOString();
  const ts = Math.max(...items.map((i) => new Date(i.updated_at).getTime()));
  return new Date(ts).toISOString();
}

function chunkMaxDate(items: SitemapItem[], page: number): string {
  const start = (page - 1) * PER_PAGE;
  const slice = items.slice(start, start + PER_PAGE);
  return maxDate(slice);
}

function paginatedEntries(prefix: string, items: SitemapItem[]): string {
  const total = Math.ceil(items.length / PER_PAGE) || 1;
  return Array.from({ length: total }, (_, i) => {
    const page = i + 1;
    const lastmod = chunkMaxDate(items, page);
    return `  <sitemap>
    <loc>${SITE_URL}/${prefix}-${page}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
  }).join('\n');
}

export async function GET(): Promise<Response> {
  if (!isSeoEnabled() || !SITE_URL || !API_URL) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>',
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
    );
  }

  try {
    const res = await fetcher<SitemapApiResponse>(`${API_URL}/sitemap`, {
      next: { revalidate: 3600 },
    });

    const d = res?.data;

    const entries = [
      `  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${maxDate(d?.pages ?? [])}</lastmod>
  </sitemap>`,
      paginatedEntries('sitemap-blog', d?.blog ?? []),
      paginatedEntries('sitemap-categories', d?.categories ?? []),
      paginatedEntries('sitemap-products', d?.products ?? []),
    ]
      .filter(Boolean)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>',
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
    );
  }
}
