import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/services', destination: '/', permanent: true },
      { source: '/services/:slug/coupons', destination: '/stores/:slug', permanent: true },
      { source: '/services/:path*', destination: '/stores/:path*', permanent: true },
      { source: '/stores', destination: '/', permanent: false },
      { source: '/coupons', destination: '/', permanent: false },
      { source: '/offers', destination: '/', permanent: true },
      { source: '/offers/:path*', destination: '/coupons/:path*', permanent: true },
      { source: '/categories/food-dining', destination: '/categories/food', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-service', permanent: true }
    ]
  }
}

export default nextConfig
