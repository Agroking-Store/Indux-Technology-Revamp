const getApiConfig = () => {
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      const parsed = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
      return {
        protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsed.hostname,
        port: parsed.port || undefined,
      };
    }
  } catch (e) {
    // fallback
  }
  return {
    protocol: 'http' as const,
    hostname: 'localhost',
    port: '5000',
  };
};

const apiConfig = getApiConfig();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.induxtechnology.com' }],
        destination: 'https://induxtechnology.com/:path*',
        permanent: true,
      },
      // Old SEO URLs mapped to New Structure
      {
        source: '/services/artificial-intelligence',
        destination: '/services/ai-chatbots',
        permanent: true,
      },
      {
        source: '/services/web-ecommerce-development',
        destination: '/services/web-dev',
        permanent: true,
      },
      {
        source: '/prisma-migrations-for-production-best-practices-and-tips',
        destination: '/blogs/prisma-migrations-for-production-best-practices-and-tips',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/services/digital-marketing-branding',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/cloud-deployment',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/themes/astra',
        destination: '/',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: apiConfig.protocol,
        hostname: apiConfig.hostname,
        port: apiConfig.port,
      },
      {
        protocol: apiConfig.protocol,
        hostname: '127.0.0.1',
        port: apiConfig.port,
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
};

module.exports = nextConfig;