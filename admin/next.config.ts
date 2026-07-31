import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
