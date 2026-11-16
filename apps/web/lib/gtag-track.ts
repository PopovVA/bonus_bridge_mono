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

/** One GA4 event for every outbound referral or affiliate CTA: partner, page, and control. */
export function trackReferralClick(partnerSlug: string, place: string, extra?: GtagEventParams): void {
  const pagePath = typeof window === 'undefined' ? undefined : window.location.pathname
  trackGtagEvent('bonus_cta', {
    ...extra,
    store_slug: partnerSlug,
    place,
    page_path: pagePath
  })
}

export type PromoTrackStatus = 'active' | 'expired'

/** Copy or official-link click on a promo code card. Uses the same gtag path as `bonus_cta`. */
export function trackPromoEvent(
  eventName: 'promo_copy' | 'promo_click',
  input: {
    promoId: string
    storeSlug: string
    place: string
    promoStatus: PromoTrackStatus
  }
): void {
  const pagePath = typeof window === 'undefined' ? undefined : window.location.pathname
  trackGtagEvent(eventName, {
    promo_id: input.promoId,
    store_slug: input.storeSlug,
    page_path: pagePath,
    place: input.place,
    promo_status: input.promoStatus
  })
}
