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

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
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
        <span className="stores-trigger-label">Stores</span>
        <span className="chevron" aria-hidden>
          ▼
        </span>
        <span className="stores-trigger-menu-icon" aria-hidden>
          ☰
        </span>
      </button>
      {open && categories.length > 0 ? (
        <>
          <div className="stores-drawer-backdrop" onClick={() => setOpen(false)} aria-hidden />
          <aside className="stores-drawer" role="dialog" aria-modal="true" aria-label="Browse stores by category">
            <div className="stores-drawer-head">
              <h2 className="stores-drawer-title">Browse stores</h2>
              <button
                type="button"
                className="stores-drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close stores menu"
              >
                ✕
              </button>
            </div>
            <div className="stores-drawer-body">
              <ul className="stores-drawer-cats">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      className={activeSlug === cat.slug ? 'stores-drawer-cat stores-drawer-cat--active' : 'stores-drawer-cat'}
                      onClick={() => setActiveSlug(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="stores-drawer-stores">
                {activeStores.map((store) => (
                  <li key={store.slug}>
                    <Link href={`/stores/${store.slug}`} className="stores-drawer-store" onClick={() => setOpen(false)}>
                      <span className="stores-mega-store-icon-wrap" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element -- brand marks from /public */}
                        <img
                          src={store.imageSrc}
                          alt=""
                          width={40}
                          height={40}
                          className="stores-mega-store-icon"
                          decoding="async"
                        />
                      </span>
                      <span className="stores-mega-store-label">{store.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div
            className="stores-mega stores-mega--desktop"
            role="dialog"
            aria-label="Browse stores by category"
          >
          <div className="stores-mega-inner">
            <div className="stores-mega-col stores-mega-cats">
              <ul className="stores-mega-list stores-mega-list--flush-top">
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
                          width={40}
                          height={40}
                          className="stores-mega-cat-icon"
                          decoding="async"
                        />
                      </span>
                      <span className="stores-mega-cat-label">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="stores-mega-col stores-mega-stores">
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
                        <span className="stores-mega-store-icon-wrap" aria-hidden="true">
                          {/* eslint-disable-next-line @next/next/no-img-element -- brand marks from /public */}
                          <img
                            src={store.imageSrc}
                            alt=""
                            width={40}
                            height={40}
                            className="stores-mega-store-icon"
                            decoding="async"
                          />
                        </span>
                        <span className="stores-mega-store-label">{store.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          </div>
        </>
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
