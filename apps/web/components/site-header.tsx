import Link from 'next/link'
import { StoresNav } from './stores-nav'

type Category = {
  id: string
  name: string
  slug: string
}

type Props = {
  categories?: Category[]
}

export function SiteHeader({ categories = [] }: Props) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="BonusBridge home">
          BonusBridge
        </Link>
        <nav className="main-nav">
          <StoresNav categories={categories} />
          <Link href="/coupons" className="nav-link">
            Coupons
          </Link>
        </nav>
        <form action="/stores" method="get" className="header-search">
          <label htmlFor="header-search-input" className="sr-only">
            Search stores
          </label>
          <input
            id="header-search-input"
            type="search"
            name="q"
            placeholder="Search stores..."
            aria-label="Search stores"
            className="search-input"
          />
          <button type="submit" className="copy-btn">
            Search
          </button>
        </form>
      </div>
    </header>
  )
}
