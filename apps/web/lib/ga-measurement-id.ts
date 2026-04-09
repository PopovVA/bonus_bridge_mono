const DEFAULT_GA_MEASUREMENT_ID = 'G-9GPFJN1LKC'

/** True when running a production Next.js build (`next build` + `next start`). False in `next dev`. */
export function shouldLoadGoogleAnalytics(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** GA4 measurement ID for gtag.js; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
export function getGaMeasurementId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  return fromEnv || DEFAULT_GA_MEASUREMENT_ID
}
