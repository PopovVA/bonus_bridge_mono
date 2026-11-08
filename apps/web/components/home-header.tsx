'use client'

import { TrackedLink } from '@/components/tracked-link'
import { StoreNameSearch } from '@/components/store-name-search'
import { StoresNav } from '@/components/stores-nav'
import { ThemeToggle } from '@/components/theme-toggle'
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
            <svg className="home-logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M3 24 H29" />
              <path d="M9 24 V8 M23 24 V8" />
              <path d="M3 17 Q6 15 9 8 Q16 26 23 8 Q26 15 29 17" />
            </svg>
            <span className="home-logo__word">
              Bonus<span>Bridge</span>
            </span>
          </TrackedLink>
          <nav className="home-nav home-nav--primary" aria-label="Primary">
            <TrackedLink href="/articles" className="home-nav__articles-link" event="header_nav_articles">
              Guides
            </TrackedLink>
            <TrackedLink href="/#coupons" className="home-nav__coupons-link" event="header_nav_coupons">
              Coupons
            </TrackedLink>
            <StoresNav megaMenu={megaMenu} />
          </nav>
        </div>
        <div className="home-header-tools">
          <StoreNameSearch />
          <ThemeToggle />
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  )
}
