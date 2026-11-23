import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  assetPrefix: process.env.PORTFOLIO_BUILD_ASSET_PREFIX ?? '',
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
