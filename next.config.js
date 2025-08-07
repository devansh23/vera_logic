require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.myntassets.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'static.zara.net'
      },
      {
        protocol: 'https',
        hostname: '*.zara.com'
      },
      {
        protocol: 'https',
        hostname: '*.zara.net'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      }
    ]
  },
  env: {
    ROBOFLOW_API_KEY: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
  },
}

module.exports = nextConfig