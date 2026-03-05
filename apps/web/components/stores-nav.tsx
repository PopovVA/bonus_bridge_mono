'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

type Category = {
  id: string
  name: string
  slug: string
}

type Props = {
  categories?: Category[]
}

export function StoresNav({ categories = [] }: Props) {
  const [open, setOpen] = useState(false)
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

  return (
    <div className="stores-nav" ref={ref}>
      <button
        type="button"
        className="nav-link nav-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Stores
        <span className="chevron" aria-hidden>
          ▼
        </span>
      </button>
      {open && (
        <div className="stores-dropdown" role="menu">
          <Link href="/stores" className="dropdown-item" onClick={() => setOpen(false)} role="menuitem">
            All Stores
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/stores?category=${cat.slug}`}
              className="dropdown-item"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
