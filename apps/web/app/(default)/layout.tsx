import type { ReactNode } from 'react'
import '../home.css'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { getStoresMegaMenu, type StoresMegaMenuPayload } from '@/lib/site-data'

const chimeSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-chime-serif',
  display: 'swap'
})

const chimeUi = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-chime-ui',
  display: 'swap'
})

const emptyMega: StoresMegaMenuPayload = { categories: [], storesByCategorySlug: {} }

export default async function DefaultLayout({ children }: { children: ReactNode }) {
  const megaMenu = await getStoresMegaMenu().catch(() => emptyMega)

  return (
    <div className={`home-page default-app-shell ${chimeSerif.variable} ${chimeUi.variable}`}>
      <HomeHeader megaMenu={megaMenu} />
      <main className="default-main">{children}</main>
      <HomeFooter />
    </div>
  )
}
