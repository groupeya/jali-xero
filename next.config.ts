import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
};

export default nextConfig;
