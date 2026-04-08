import { describe, expect, it } from 'vitest'
import { sortOffersPromoCodesFirst } from './offer-sort'

describe('sortOffersPromoCodesFirst', () => {
  it('places offers with a promo code before link-only offers', () => {
    const out = sortOffersPromoCodesFirst([
      { id: '1', couponCode: null },
      { id: '2', couponCode: 'SAVE' },
      { id: '3', couponCode: '  ' },
      { id: '4', couponCode: 'X' }
    ])
    expect(out.map((o) => o.id)).toEqual(['2', '4', '1', '3'])
  })
})
