import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ClientCatalogProvider } from '@/components/client-catalog-provider'
import { GoogleAnalytics } from '@/components/google-analytics'
import { getSiteUrl } from '@/app/seo'
import { getClientCatalog } from '@/lib/site-data'

const appSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-app',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'BonusBridge',
    template: '%s | BonusBridge'
  },
  description: 'Find referral bonuses and coupons by store.',
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getClientCatalog()
  return (
    <html lang="en" className={appSans.variable}>
      <body>
        <GoogleAnalytics />
        <ClientCatalogProvider value={catalog}>{children}</ClientCatalogProvider>
      </body>
    </html>
  )
}
