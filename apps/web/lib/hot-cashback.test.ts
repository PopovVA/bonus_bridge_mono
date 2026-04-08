import { describe, expect, it } from 'vitest'
import { getHotCashbackOfferByStoreSlug } from './hot-cashback'

describe('getHotCashbackOfferByStoreSlug', () => {
  it('returns curated Rakuten copy for Explore More / home parity', () => {
    const h = getHotCashbackOfferByStoreSlug('rakuten')
    expect(h?.badgeText).toBe('$50 bonus')
    expect(h?.ctaText).toBe('Get the bonus')
    expect(h?.description).toBe(
      'Register for up to $50 after qualifying spend—Rakuten pays cashback when you shop its partner stores.'
    )
    expect(h?.href).toBe('https://www.rakuten.com/r/MVADIM7')
  })

  it('returns undefined when slug is not in curated list', () => {
    expect(getHotCashbackOfferByStoreSlug('no-such-store')).toBeUndefined()
  })

  it('includes Public for store-page / Explore More lookups', () => {
    expect(getHotCashbackOfferByStoreSlug('public')?.ctaText).toBe('Join Public')
  })
})
