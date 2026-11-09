import type { MonthlyTopOffer } from '@/lib/schemas'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCuratedLinkCardCopyForExploreMore } from './explore-more-link-card-copy'
import * as siteData from './site-data'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getCuratedLinkCardCopyForExploreMore', () => {
  it('uses the home monthly row for TopCashback and has no Klarna or Public referral card', () => {
    const c = getCuratedLinkCardCopyForExploreMore('topcashback')
    expect(c?.badgeText).toBe('Terms apply')
    expect(c?.ctaText).toBe('Join TopCashback')
    expect(c?.href).toBe('https://www.topcashback.com/ref/member344836925437')
    expect(c?.headline).toBeNull()
    expect(getCuratedLinkCardCopyForExploreMore('klarna')).toBeNull()
    expect(getCuratedLinkCardCopyForExploreMore('public')).toBeNull()
    expect(getCuratedLinkCardCopyForExploreMore('robinhood')).toBeNull()
  })

  it('uses partner-offer copy when slug is not in monthly row', () => {
    const c = getCuratedLinkCardCopyForExploreMore('rakuten')
    expect(c?.badgeText).toBe('Terms apply')
    expect(c?.ctaText).toBe('Join Rakuten')
    expect(c?.headline).toBe('Rakuten welcome bonus varies')
  })

  it('returns null when slug has no curated copy', () => {
    expect(getCuratedLinkCardCopyForExploreMore('unknown-brand-xyz')).toBeNull()
  })

  it('defaults badge to Offer when monthly snapshot omits badgeText', () => {
    vi.spyOn(siteData, 'getMonthlyTopOfferSnapshotBySlug').mockReturnValue({
      id: '00000000-0000-4000-8000-000000000099',
      brandName: 'Test',
      slug: 'test-brand',
      description: 'Desc',
      ctaText: 'Go',
      href: 'https://example.com/',
      logoSrc: '/x.svg'
    } as MonthlyTopOffer)
    const c = getCuratedLinkCardCopyForExploreMore('test-brand')
    expect(c?.badgeText).toBe('Offer')
    expect(c?.headline).toBeNull()
  })
})
