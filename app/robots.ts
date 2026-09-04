
import type { MetadataRoute } from 'next';
import { isSeoEnabled } from '@/lib/seo';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_ENDPOINT ?? '').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
    if (!isSeoEnabled()) {
        return {
            rules: { userAgent: '*', disallow: '/' },
            host: SITE_URL,
        };
    }
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/basket/',
                '/checkout/',
                '/dashboard/*',
                '/*?q=',
                '/*?search=',
                '/*?*has_discount=',
                '/*?*available=',
                '/*?*attribute_values=',
                '/*?*min_amount=',
                '/*?*max_amount=',
                '/brands/*',
                '/*?*color=',
                '/*?*sort=',
                '/*?*orderby=',
                '/*?*filter=',
                '/*?*tag=',
                '/*?*utm_',
                '/*?*ref=',
                '/*?*campaign=',
                '/*?*tab=',
                '/api/',
                '/compare',
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}