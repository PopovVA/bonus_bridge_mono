'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { getGaMeasurementId } from '@/lib/ga-measurement-id'
import { isAnalyticsEnabledForHostname } from '@/lib/gtag-track'

export function GoogleAnalytics() {
  const gaId = getGaMeasurementId()
  const hostname = typeof window === 'undefined' ? '' : window.location.hostname
  const enabled = hostname ? isAnalyticsEnabledForHostname(hostname) : false

  useEffect(() => {
    if (!hostname) return
    if (enabled) {
      console.info(`[Analytics] Enabled on host ${hostname}. Measurement ID: ${gaId}`)
    } else {
      console.info(`[Analytics] Disabled on host ${hostname}.`)
    }
  }, [enabled, gaId, hostname])

  if (!enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
