import type { ReactNode } from 'react'
import '../home.css'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { getStoresMegaMenu, type StoresMegaMenuPayload } from '@/lib/site-data'

const emptyMega: StoresMegaMenuPayload = { categories: [], storesByCategorySlug: {} }

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const megaMenu = await getStoresMegaMenu().catch(() => emptyMega)

  return (
    <div className="home-page">
      <HomeHeader megaMenu={megaMenu} />
      <main>{children}</main>
      <HomeFooter />
    </div>
  )
}
