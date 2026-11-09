'use client'

import { Moon, Sun } from 'lucide-react'
import { trackGtagEvent } from '@/lib/gtag-track'
import { revealRadius } from '@/lib/motion-math'
import { THEME_STORAGE_KEY, nextTheme, parseStoredTheme, type Theme } from '@/lib/theme'

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* private mode: the choice just will not persist */
  }
}

/** Light/dark switch. The new theme grows as a circle from the button (View Transitions API) where supported. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between light and dark theme"
      data-magnetic
      onClick={(e) => {
        const current = parseStoredTheme(document.documentElement.dataset.theme) ?? 'light'
        const target = nextTheme(current)
        trackGtagEvent('theme_toggle', { theme: target })

        const doc = document as ViewTransitionDocument
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (!doc.startViewTransition || reduced) {
          applyTheme(target)
          return
        }
        const rect = e.currentTarget.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2
        const root = document.documentElement.style
        root.setProperty('--vt-x', `${x}px`)
        root.setProperty('--vt-y', `${y}px`)
        root.setProperty('--vt-r', `${revealRadius(x, y, window.innerWidth, window.innerHeight)}px`)
        doc.startViewTransition(() => applyTheme(target))
      }}
    >
      <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={18} strokeWidth={2} aria-hidden />
      <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={18} strokeWidth={2} aria-hidden />
    </button>
  )
}
