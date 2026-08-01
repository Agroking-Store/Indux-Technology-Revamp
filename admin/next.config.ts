import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin",
        basePath: false,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;