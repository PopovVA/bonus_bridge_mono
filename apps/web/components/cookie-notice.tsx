'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_EVENT, readCookieConsent, writeCookieConsent, type CookieConsent } from '@/lib/cookie-notice'

/** Asks before analytics cookies. Does not lock the rest of the page. */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Storage is unavailable during SSR. Reading it while rendering would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the notice only after mount
    setVisible(readCookieConsent(window.localStorage) === null)
  }, [])

  if (!visible) return null

  function choose(value: CookieConsent) {
    writeCookieConsent(window.localStorage, value)
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))
    setVisible(false)
  }

  return (
    <div className="cookie-notice" role="region" aria-label="Cookie notice">
      <p className="cookie-notice__text">
        BonusBridge uses a cookie to remember this choice. Analytics cookies load only if you accept. Referral links
        may set cookies on the provider site. Read the <Link href="/cookies">Cookie Notice</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <div className="cookie-notice__actions">
        <button type="button" className="cookie-notice__decline" onClick={() => choose('declined')}>
          Decline
        </button>
        <button type="button" className="cookie-notice__dismiss" onClick={() => choose('accepted')}>
          Accept
        </button>
      </div>
    </div>
  )
}
