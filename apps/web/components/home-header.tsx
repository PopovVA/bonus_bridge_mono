'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'

export function HomeHeader() {
  return (
    <header className="home-header">
      <div className="home-header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <Link href="/" className="home-logo" aria-label="BonusBridge home">
            BonusBridge
          </Link>
          <nav className="home-nav">
            <Link href="/stores">Stores</Link>
            <Link href="/coupons">Coupons</Link>
          </nav>
        </div>
        <form action="/stores" method="get" className="home-search-wrap">
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
