import { describe, expect, it } from 'vitest'
import { getHotCashbackOfferByStoreSlug } from './hot-cashback'

describe('getHotCashbackOfferByStoreSlug', () => {
  it('returns curated Rakuten copy for Explore More / home parity', () => {
    const h = getHotCashbackOfferByStoreSlug('rakuten')
    expect(h?.badgeText).toBe('Terms apply')
    expect(h?.ctaText).toBe('See offer details')
    expect(h?.description).toBe(
      'Learn about Rakuten new-member offer details, qualifying spend requirements, and current provider terms.'
    )
    expect(h?.href).toBe('https://www.rakuten.com/r/MVADIM7')
  })

  it('returns undefined when slug is not in curated list', () => {
    expect(getHotCashbackOfferByStoreSlug('no-such-store')).toBeUndefined()
  })

  it('includes Public for store-page / Explore More lookups', () => {
    expect(getHotCashbackOfferByStoreSlug('public')?.ctaText).toBe('See offer details')
  })

  it('includes Chime with terms badge for Explore More', () => {
    const c = getHotCashbackOfferByStoreSlug('chime')
    expect(c?.badgeText).toBe('Terms apply')
    expect(c?.headline).toBe('Chime new-account offer details')
  })
})
