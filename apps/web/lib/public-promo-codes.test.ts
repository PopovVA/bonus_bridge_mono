import { describe, expect, it } from 'vitest'
import {
  PUBLIC_PROMO_CODES,
  isPromoCodeLive,
  livePromoCodes,
  monogramDataUri,
  toClipCoupon,
  type PublicPromoCode
} from '@/lib/public-promo-codes'

const base: PublicPromoCode = {
  id: 'x',
  brand: 'Test Brand',
  title: 't',
  blurb: 'b.',
  code: 'CODE',
  url: 'https://example.com',
  source: 'newsletter',
  checkedAt: '2026-11-10',
  expiresAt: null
}

describe('public promo codes', () => {
  it('hides a dated code after its end', () => {
    const dated = { ...base, expiresAt: '2026-12-01T07:59:00Z' }
    expect(isPromoCodeLive(dated, new Date('2026-11-30T12:00:00Z'))).toBe(true)
    expect(isPromoCodeLive(dated, new Date('2026-12-01T08:00:00Z'))).toBe(false)
  })

  it('hides an undated code 30 days after it was checked', () => {
    expect(isPromoCodeLive(base, new Date('2026-12-09T00:00:00Z'))).toBe(true)
    expect(isPromoCodeLive(base, new Date('2026-12-10T00:00:01Z'))).toBe(false)
  })

  it('filters the list and defaults to the real catalog', () => {
    expect(livePromoCodes(new Date('2027-06-01'), [base])).toEqual([])
    expect(livePromoCodes(new Date('2026-11-10T12:00:00Z')).map((c) => c.code)).toEqual(
      PUBLIC_PROMO_CODES.map((c) => c.code)
    )
    expect(livePromoCodes().length).toBeLessThanOrEqual(PUBLIC_PROMO_CODES.length)
  })

  it('never stores personal or referral links', () => {
    for (const code of PUBLIC_PROMO_CODES) {
      expect(code.url).not.toMatch(/\/r\/|\/ref\/|ref=|invite/i)
    }
  })

  it('builds an initials tile and the coupon card shape', () => {
    expect(decodeURIComponent(monogramDataUri('Test Brand'))).toContain('>TB<')
    expect(decodeURIComponent(monogramDataUri('x'))).toContain('>X<')
    const card = toClipCoupon(base)
    expect(card.brand).toBe('TEST BRAND')
    expect(card.blurb).toBe('b. Source: newsletter.')
    expect(card.logoSrc.startsWith('data:image/svg+xml,')).toBe(true)
  })

  it('uses the brand logo when there is one, and every logo file exists', async () => {
    const { existsSync } = await import('node:fs')
    const { join } = await import('node:path')
    expect(toClipCoupon({ ...base, logoSrc: '/brands/x.svg' }).logoSrc).toBe('/brands/x.svg')
    for (const code of PUBLIC_PROMO_CODES) {
      expect(code.logoSrc).toMatch(/^\/brands\//)
      expect(existsSync(join(process.cwd(), 'public', code.logoSrc!))).toBe(true)
    }
  })
})
