import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/services', destination: '/stores', permanent: true },
      { source: '/services/:slug/coupons', destination: '/stores/:slug', permanent: true },
      { source: '/services/:path*', destination: '/stores/:path*', permanent: true },
      { source: '/offers', destination: '/coupons', permanent: true },
      { source: '/offers/:path*', destination: '/coupons/:path*', permanent: true }
    ]
  }
}

export default nextConfig
