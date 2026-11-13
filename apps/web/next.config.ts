import type { NextConfig } from 'next'
import { legacyRedirectRules } from './lib/legacy-redirects'

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
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-service', permanent: true },
      {
        source: '/compare/rakuten-vs-topcashback',
        destination: '/guides/rakuten-vs-topcashback',
        permanent: true
      },
      ...legacyRedirectRules()
    ]
  }
}

export default nextConfig
