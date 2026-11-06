'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { dismissCookieNotice, isCookieNoticeDismissed } from '@/lib/cookie-notice'

/** Lightweight, non-blocking notice. It does not gate the page. */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Storage is unavailable during SSR. Reading it while rendering would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the notice only after mount
    setVisible(!isCookieNoticeDismissed(window.localStorage))
  }, [])

  if (!visible) return null

  return (
    <div className="cookie-notice" role="region" aria-label="Cookie notice">
      <p className="cookie-notice__text">
        BonusBridge uses cookies to run the site and measure traffic. Referral links may set cookies on the provider’s
        site. Read the <Link href="/cookies">Cookie Notice</Link> and <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <button
        type="button"
        className="cookie-notice__dismiss"
        onClick={() => {
          dismissCookieNotice(window.localStorage)
          setVisible(false)
        }}
      >
        Got it
      </button>
    </div>
  )
}
