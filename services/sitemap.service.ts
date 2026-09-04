import http from '@/services/core/clientService';

const PER_PAGE = 2000;

export interface SitemapItem {
  title: string;
  updated_at: string;
  image: string;
  url: string;
}

export interface SitemapData {
  pages: SitemapItem[];
  blog: SitemapItem[];
  categories: SitemapItem[];
  products: SitemapItem[];
}

export interface SitemapFileMeta {
  name: string;
  url: string;
  lastModified: string;
}

interface SitemapResponse {
  status: string;
  data: SitemapData;
}

const SITEMAP_URL = '/sitemap';

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

function paginatedFiles(
  base: string,
  prefix: string,
  items: SitemapItem[],
): SitemapFileMeta[] {
  const total = Math.ceil(items.length / PER_PAGE) || 1;
  return Array.from({ length: total }, (_, i) => {
    const page = i + 1;
    return {
      name: `${prefix}-${page}.xml`,
      url: `${base}/${prefix}-${page}.xml`,
      lastModified: chunkMaxDate(items, page),
    };
  });
}

export async function sitemapCSR(): Promise<SitemapData> {
  const { data } = await http.get<SitemapResponse>(SITEMAP_URL);
  return data.data;
}

export function getSitemapFileList(data: SitemapData, siteUrl: string): SitemapFileMeta[] {
  const base = siteUrl.replace(/\/$/, '');

  return [
    {
      name: 'sitemap-pages.xml',
      url: `${base}/sitemap-pages.xml`,
      lastModified: maxDate(data.pages),
    },
    ...paginatedFiles(base, 'sitemap-blog', data.blog),
    ...paginatedFiles(base, 'sitemap-categories', data.categories),
    ...paginatedFiles(base, 'sitemap-products', data.products),
  ];
}
