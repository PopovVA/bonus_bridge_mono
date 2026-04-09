import Script from 'next/script'
import { getGaMeasurementId, shouldLoadGoogleAnalytics } from '@/lib/ga-measurement-id'

export function GoogleAnalytics() {
  if (!shouldLoadGoogleAnalytics()) return null
  const gaId = getGaMeasurementId()
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
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
