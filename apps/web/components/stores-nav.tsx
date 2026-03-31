'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { StoresMegaMenuPayload } from '@/lib/site-data'

type Props = {
  megaMenu: StoresMegaMenuPayload
}

export function StoresNav({ megaMenu }: Props) {
  const { categories, storesByCategorySlug } = megaMenu
  const firstSlug = categories[0]?.slug ?? ''
  const [open, setOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState(firstSlug)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const activeStores = activeSlug ? (storesByCategorySlug[activeSlug] ?? []) : []

  return (
    <div className="stores-nav" ref={ref}>
      <button
        type="button"
        className="nav-link nav-dropdown-trigger"
        onClick={() => {
          setOpen((wasOpen) => {
            if (wasOpen) return false
            if (firstSlug) {
              setActiveSlug((prev) => (categories.some((c) => c.slug === prev) ? prev : firstSlug))
            }
            return true
          })
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        Stores
        <span className="chevron" aria-hidden>
          ▼
        </span>
      </button>
      {open && categories.length > 0 ? (
        <div
          className="stores-mega"
          role="dialog"
          aria-label="Browse stores by category"
        >
          <div className="stores-mega-inner">
            <div className="stores-mega-col stores-mega-cats">
              <p className="stores-mega-heading">Categories</p>
              <ul className="stores-mega-list">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className={
                        activeSlug === cat.slug
                          ? 'stores-mega-cat stores-mega-cat--active'
                          : 'stores-mega-cat'
                      }
                      onMouseEnter={() => setActiveSlug(cat.slug)}
                      onFocus={() => setActiveSlug(cat.slug)}
                      onClick={() => setOpen(false)}
                    >
                      <span className="stores-mega-cat-icon-wrap" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG from /public/categories */}
                        <img
                          src={cat.imageSrc}
                          alt=""
                          width={24}
                          height={24}
                          className="stores-mega-cat-icon"
                          decoding="async"
                        />
                      </span>
                      <span className="stores-mega-cat-label">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/" className="stores-mega-footer-link" onClick={() => setOpen(false)}>
                All categories
              </Link>
            </div>
            <div className="stores-mega-col stores-mega-stores">
              <p className="stores-mega-heading">Stores</p>
              {activeStores.length === 0 ? (
                <p className="stores-mega-empty meta">No stores in this category yet.</p>
              ) : (
                <ul className="stores-mega-list">
                  {activeStores.map((store) => (
                    <li key={store.slug}>
                      <Link
                        href={`/stores/${store.slug}`}
                        className="stores-mega-store"
                        onClick={() => setOpen(false)}
                      >
                        {store.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="stores-mega-footer">
                <Link
                  href={activeSlug ? `/categories/${activeSlug}` : '/'}
                  className="stores-mega-footer-link"
                  onClick={() => setOpen(false)}
                >
                  View category page
                </Link>
                <Link href="/" className="stores-mega-footer-link" onClick={() => setOpen(false)}>
                  All stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {open && categories.length === 0 ? (
        <div className="stores-dropdown" role="menu">
          <Link href="/" className="dropdown-item" onClick={() => setOpen(false)} role="menuitem">
            All stores
          </Link>
        </div>
      ) : null}
    </div>
  )
}
