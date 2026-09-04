/**
 * Central SEO toggle.
 * Set NEXT_PUBLIC_SEO_ENABLED="false" in .env to disable all SEO output:
 *   - page metadata (title, description, OG, Twitter cards)
 *   - JSON-LD structured data
 *   - sitemaps (all indexes and detail pages)
 *   - robots.txt sitemap reference
 */

/** Default robots value when SEO is ON and backend sends no value. */
export const SEO_DEFAULT_ROBOTS = 'index, follow';

export function isSeoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SEO_ENABLED !== 'false';
}
