require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      }
    ]
  },
  env: {
    ROBOFLOW_API_KEY: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
  },
}

module.exports = nextConfig