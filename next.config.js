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
  }
}

module.exports = nextConfig