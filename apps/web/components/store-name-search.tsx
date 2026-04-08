'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useClientCatalog } from '@/components/client-catalog-provider'
import { buildStoreSearchIndex, filterStoresByQuery } from '@/lib/store-name-search'

const listId = 'store-name-search-results'

export function StoreNameSearch() {
  const catalog = useClientCatalog()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const index = useMemo(() => (catalog ? buildStoreSearchIndex(catalog) : []), [catalog])
  const matches = useMemo(() => filterStoresByQuery(index, query), [index, query])

  if (!catalog) return null

  const showPanel = open && query.trim().length > 0

  return (
    <div className="home-header-search">
      <label htmlFor="store-name-search-input" className="sr-only">
        Search stores by name
      </label>
      <div className="home-header-search-field">
        <Search className="home-header-search-icon" aria-hidden size={18} strokeWidth={2} />
        <input
          id="store-name-search-input"
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Search stores…"
          className="home-header-search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 180)
          }}
        />
      </div>
      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="home-header-search-panel"
          onMouseDown={(e) => e.preventDefault()}
        >
          {matches.length === 0 ? (
            <p className="home-header-search-empty">No stores match</p>
          ) : (
            <ul className="home-header-search-list">
              {matches.map((row) => (
                <li key={row.slug} role="presentation">
                  <Link
                    role="option"
                    href={`/stores/${encodeURIComponent(row.slug)}`}
                    className="home-header-search-hit"
                    onClick={() => {
                      setQuery('')
                      setOpen(false)
                    }}
                  >
                    {row.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
