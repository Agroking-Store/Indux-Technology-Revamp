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
};

module.exports = nextConfig;