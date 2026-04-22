import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      minify: true,
      transpileTemplateLiterals: true,
      pure: true,
    },
  },
  images: {
    // In development, disable optimization to allow localhost images
    // In production, optimization is enabled for performance
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      // Development: localhost backend
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      // Production: configure your actual backend domain
      {
        protocol: 'https',
        hostname: 'api.honestneed.com',
      },
      // Fallback for any subdomain
      {
        protocol: 'https',
        hostname: '**.honestneed.com',
      },
    ],
  },
  // ✅ API Proxy: Forward all /api/* requests to backend
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
