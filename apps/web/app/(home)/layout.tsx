import type { ReactNode } from 'react'
import '../home.css'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
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

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const megaMenu = await getStoresMegaMenu().catch(() => emptyMega)

  return (
    <div className={`home-page ${chimeSerif.variable} ${chimeUi.variable}`}>
      <HomeHeader megaMenu={megaMenu} />
      <main>{children}</main>
      <HomeFooter />
    </div>
  )
}
