import type { HomeClipCoupon } from '@/lib/home-clip-coupons'

/**
 * Promo codes a brand published to everyone (its own site or a mass newsletter).
 * Not referral links: BonusBridge earns nothing from these. Personal or single-use codes never go here.
 *
 * A code disappears on its own after `expiresAt`. A code without a published end date disappears
 * `UNDATED_TTL_DAYS` after `checkedAt`, so a stale code never lingers.
 */
export type PublicPromoCode = {
  id: string
  brand: string
  title: string
  blurb: string
  code: string
  /** Official page where the code is redeemed. */
  url: string
  /** Where the code was published, shown to readers. */
  source: string
  /** ISO date the code was last seen live. */
  checkedAt: string
  /** ISO timestamp when the brand says the offer ends; null when no end date is published. */
  expiresAt: string | null
  /** Brand logo under /public; falls back to an initials tile. */
  logoSrc?: string
}

export const UNDATED_TTL_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

export const PUBLIC_PROMO_CODES: PublicPromoCode[] = [
  {
    id: 'promo-leetcode-thanks2026',
    brand: 'LeetCode',
    title: '$30 off LeetCode Premium (annual)',
    blurb: 'Annual Premium for $129 with the code at checkout. Ends Nov 30, 11:59 pm PT.',
    code: 'THANKS2026',
    url: 'https://leetcode.com/subscribe/',
    source: 'LeetCode email newsletter',
    logoSrc: '/brands/leetcode.svg',
    checkedAt: '2026-11-10',
    expiresAt: '2026-12-01T07:59:00Z'
  },
  {
    id: 'promo-visible-blackfriday',
    brand: 'Visible',
    title: '50% off Visible+ Pro annual plan',
    blurb: 'A full year of Visible+ Pro for $225 upfront with the code. Limited time; no end date published.',
    code: 'BLACKFRIDAY',
    url: 'https://www.visible.com/deals',
    source: 'Visible deals page',
    logoSrc: '/brands/visible.svg',
    checkedAt: '2026-11-10',
    expiresAt: null
  },
  {
    id: 'promo-visible-holidayhack',
    brand: 'Visible',
    title: 'Visible plan for $19/mo for 1 year',
    blurb: 'The base Visible plan at $19/mo for the first year with the code. Limited time; no end date published.',
    code: 'HOLIDAYHACK',
    url: 'https://www.visible.com/deals',
    source: 'Visible deals page',
    logoSrc: '/brands/visible.svg',
    checkedAt: '2026-11-10',
    expiresAt: null
  }
]

export function isPromoCodeLive(code: PublicPromoCode, now: Date): boolean {
  if (code.expiresAt) return new Date(code.expiresAt).getTime() > now.getTime()
  return new Date(`${code.checkedAt}T00:00:00Z`).getTime() + UNDATED_TTL_DAYS * DAY_MS > now.getTime()
}

export function livePromoCodes(now: Date = new Date(), list: PublicPromoCode[] = PUBLIC_PROMO_CODES): PublicPromoCode[] {
  return list.filter((code) => isPromoCodeLive(code, now))
}

/** Brand initials on a light tile, so the card needs no third-party logo file. */
export function monogramDataUri(brand: string): string {
  const letters = brand
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fff4ee"/><text x="32" y="41" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="800" fill="#c23a06">${letters}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Shape the tear-off coupon grid already renders. */
export function toClipCoupon(code: PublicPromoCode): HomeClipCoupon {
  return {
    id: code.id,
    brand: code.brand.toUpperCase(),
    title: code.title,
    blurb: `${code.blurb} Source: ${code.source}.`,
    code: code.code,
    openUrl: code.url,
    logoSrc: code.logoSrc ?? monogramDataUri(code.brand)
  }
}
