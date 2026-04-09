/** Params sent to GA4 `gtag('event', …)` — keep values short; use strings for dimensions. */
export type GtagEventParams = Record<string, string | number | undefined>

/**
 * Sends a GA4 custom event when gtag is loaded (production client only).
 * No-ops in development and when `window.gtag` is missing.
 */
export function trackGtagEvent(eventName: string, params?: GtagEventParams): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  const cleaned = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string | number][]
      )
    : undefined
  gtag('event', eventName, cleaned ?? {})
}
