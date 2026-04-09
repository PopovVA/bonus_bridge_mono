import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ClientCatalogProvider } from '@/components/client-catalog-provider'
import { GoogleAnalytics } from '@/components/google-analytics'
import { getClientCatalog } from '@/lib/site-data'

const appSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-app',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'BonusBridge',
  description: 'Find referral bonuses and coupons by store.'
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
