'use client'

import { TrackedLink } from '@/components/tracked-link'
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
          <TrackedLink href="/" className="home-logo" aria-label="BonusBridge home" event="header_logo">
            BonusBridge
          </TrackedLink>
          <nav className="home-nav home-nav--primary" aria-label="Primary">
            <TrackedLink href="/articles" className="home-nav__articles-link" event="header_nav_articles">
              Money Guides
            </TrackedLink>
            <TrackedLink href="/#coupons" className="home-nav__coupons-link" event="header_nav_coupons">
              Coupons
            </TrackedLink>
            <StoresNav megaMenu={megaMenu} />
          </nav>
        </div>
        <StoreNameSearch />
      </div>
    </header>
  )
}
