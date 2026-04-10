const DEFAULT_GA_MEASUREMENT_ID = 'G-9GPFJN1LKC'

/** GA4 measurement ID for gtag.js; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
export function getGaMeasurementId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  return fromEnv || DEFAULT_GA_MEASUREMENT_ID
}
