'use client'

import Link from 'next/link'
import { StoreNameSearch } from '@/components/store-name-search'
import { StoresNav } from '@/components/stores-nav'
import type { StoresMegaMenuPayload } from '@/lib/site-data'

type Props = {
  megaMenu: StoresMegaMenuPayload
}

export function HomeHeader({ megaMenu }: Props) {
  return (
    <header className="home-header">
      <div className="home-header-inner">
        <div className="home-header-brand-nav">
          <Link href="/" className="home-logo" aria-label="BonusBridge home">
            BonusBridge
          </Link>
          <nav className="home-nav home-nav--primary">
            <StoresNav megaMenu={megaMenu} />
            <Link href="/#coupons">Coupons</Link>
          </nav>
        </div>
        <StoreNameSearch />
      </div>
    </header>
  )
}
