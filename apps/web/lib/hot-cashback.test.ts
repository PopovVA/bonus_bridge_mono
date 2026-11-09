import { describe, expect, it } from 'vitest'
import { programClaim } from '@/lib/referral-programs'
import { getHotCashbackOfferByStoreSlug } from './hot-cashback'

describe('getHotCashbackOfferByStoreSlug', () => {
  it('returns curated Rakuten copy for Explore More / home parity', () => {
    const h = getHotCashbackOfferByStoreSlug('rakuten')
    expect(h?.badgeText).toBe('Terms apply')
    expect(h?.ctaText).toBe('Join Rakuten')
    expect(h?.headline).toBe('Rakuten welcome bonus varies')
    expect(h?.description).toBe(programClaim('rakuten'))
    expect(h?.href).toBe('https://www.rakuten.com/r/MVADIM7')
  })

  it('returns undefined when slug is not in curated list', () => {
    expect(getHotCashbackOfferByStoreSlug('no-such-store')).toBeUndefined()
  })

  it('does not keep an unlisted referral card in the curated list', () => {
    expect(getHotCashbackOfferByStoreSlug('public')).toBeUndefined()
    expect(getHotCashbackOfferByStoreSlug('klarna')).toBeUndefined()
    expect(getHotCashbackOfferByStoreSlug('lemonade')).toBeUndefined()
  })

  it('includes Chime with the annual-cap rules', () => {
    const c = getHotCashbackOfferByStoreSlug('chime')
    expect(c?.badgeText).toBe('$100 for new members')
    expect(c?.headline).toBe('Chime referral requirements')
    expect(c?.description).toContain('10 per calendar year')
  })
})
