import type { NextConfig } from 'next';

const siteEndpoint = process.env.NEXT_PUBLIC_BACKEND_IMAGE;
const siteUrl = siteEndpoint ? new URL(siteEndpoint.includes('://') ? siteEndpoint : `https://${siteEndpoint}`) : null;
const siteHostname = siteUrl?.hostname ?? '';
const sitePort = siteUrl?.port || undefined;

const siteRemotePatterns = siteHostname
  ? [
      { protocol: 'https' as const, hostname: siteHostname, ...(sitePort ? { port: sitePort } : {}), pathname: '/**' as const },
      { protocol: 'http' as const, hostname: siteHostname, ...(sitePort ? { port: sitePort } : {}), pathname: '/**' as const },
    ]
  : [];
const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.16.11.160'],
  crossOrigin: 'anonymous',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/sitemap-blog-:id.xml',
        destination: '/api/sitemap/blog/:id',
      },
      {
        source: '/sitemap-categories-:id.xml',
        destination: '/api/sitemap/categories/:id',
      },
      {
        source: '/sitemap-products-:id.xml',
        destination: '/api/sitemap/products/:id',
      },
    ];
  },
  images: {
    qualities: [100],
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...siteRemotePatterns,
      
    ],
  },
};

export default nextConfig;
