'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_EVENT, readCookieConsent } from '@/lib/cookie-notice'
import { getGaMeasurementId } from '@/lib/ga-measurement-id'
import { isAnalyticsEnabledForHostname } from '@/lib/gtag-track'

export function GoogleAnalytics() {
  const gaId = getGaMeasurementId()
  const hostname = typeof window === 'undefined' ? '' : window.location.hostname
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!hostname) return
    if (!isAnalyticsEnabledForHostname(hostname)) {
      console.info(`[Analytics] Disabled on host ${hostname}.`)
      return
    }

    const sync = () => {
      const accepted = readCookieConsent(window.localStorage) === 'accepted'
      setAllowed(accepted)
      console.info(
        accepted
          ? `[Analytics] Enabled on host ${hostname}. Measurement ID: ${gaId}`
          : `[Analytics] Waiting for cookie consent on host ${hostname}.`
      )
    }

    sync()
    window.addEventListener(COOKIE_CONSENT_EVENT, sync)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync)
  }, [gaId, hostname])

  if (!hostname || !allowed) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
