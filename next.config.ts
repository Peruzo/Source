import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Server mode for Cloud Run (Auth0 + API routes require Node server)
  // output: 'export' removed
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
    ],
    unoptimized: true,
  },
  // The payments page moved when hosting was taken off it. permanent: true answers 308.
  async redirects() {
    return [
      { source: '/tjanster/betalningar-hosting', destination: '/tjanster/betalningar', permanent: true },
    ];
  },
};

export default nextConfig;
