'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { StoresNav } from '@/components/stores-nav'
import type { StoresMegaMenuPayload } from '@/lib/site-data'

type Props = {
  megaMenu: StoresMegaMenuPayload
}

export function HomeHeader({ megaMenu }: Props) {
  return (
    <header className="home-header">
      <div className="home-header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link href="/" className="home-logo" aria-label="BonusBridge home">
            BonusBridge
          </Link>
          <nav className="home-nav home-nav--primary">
            <StoresNav megaMenu={megaMenu} />
            <Link href="/#coupons">Coupons</Link>
          </nav>
        </div>
        <form action="/" method="get" className="home-search-wrap">
          <label htmlFor="home-search" className="sr-only">
            Search stores or coupons
          </label>
          <Search className="home-search-icon" aria-hidden />
          <input
            id="home-search"
            type="search"
            name="q"
            placeholder="Search stores or coupons..."
            className="home-search-input"
            aria-label="Search stores or coupons"
          />
        </form>
      </div>
    </header>
  )
}
