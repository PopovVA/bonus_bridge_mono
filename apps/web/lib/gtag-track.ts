/** Params sent to GA4 `gtag('event', …)` — keep values short; use strings for dimensions. */
export type GtagEventParams = Record<string, string | number | undefined>

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

/** Analytics is enabled for all hosts except localhost loopback addresses. */
export function isAnalyticsEnabledForHostname(hostname: string): boolean {
  return !LOCAL_HOSTS.has(hostname)
}

/**
 * Sends a GA4 custom event when analytics is enabled and gtag is available.
 * Emits console messages for every attempt (sent or skipped).
 */
export function trackGtagEvent(eventName: string, params?: GtagEventParams): void {
  if (typeof window === 'undefined') return

  const hostname = window.location?.hostname ?? 'localhost'
  if (!isAnalyticsEnabledForHostname(hostname)) {
    console.info(`[Analytics] Event "${eventName}" not sent because analytics is disabled on this host (${hostname}).`)
    return
  }

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') {
    console.info(`[Analytics] Event "${eventName}" not sent because gtag is not available yet.`)
    return
  }

  const cleaned = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string | number][]
      )
    : undefined
  gtag('event', eventName, cleaned ?? {})
  console.info(`[Analytics] Event "${eventName}" sent.`, cleaned ?? {})
}
