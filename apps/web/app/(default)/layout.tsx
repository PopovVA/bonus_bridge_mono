import type { ReactNode } from 'react'
import '../home.css'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { getStoresMegaMenu, type StoresMegaMenuPayload } from '@/lib/site-data'

const emptyMega: StoresMegaMenuPayload = { categories: [], storesByCategorySlug: {} }

export default async function DefaultLayout({ children }: { children: ReactNode }) {
  const megaMenu = await getStoresMegaMenu().catch(() => emptyMega)

  return (
    <div className="home-page default-app-shell">
      <HomeHeader megaMenu={megaMenu} />
      <main className="default-main">{children}</main>
      <HomeFooter />
    </div>
  )
}
