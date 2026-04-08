import type { MonthlyTopOffer } from '@/lib/schemas'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCuratedLinkCardCopyForExploreMore } from './explore-more-link-card-copy'
import * as siteData from './site-data'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getCuratedLinkCardCopyForExploreMore', () => {
  it('uses home Top monthly offers copy for Klarna', () => {
    const c = getCuratedLinkCardCopyForExploreMore('klarna')
    expect(c?.badgeText).toBe('20$ off')
    expect(c?.ctaText).toBe('Open Klarna')
    expect(c?.description).toBe(
      'Shop now, pay later — open Klarna with our invite to explore deals, flexible payments, and rewards in the app.'
    )
    expect(c?.href).toContain('klarna.com')
    expect(c?.logoSrc).toBe('/top-offers/logos/klarna-logo.svg')
  })

  it('uses Hot Cashback copy when slug is not in monthly top row', () => {
    const c = getCuratedLinkCardCopyForExploreMore('rakuten')
    expect(c?.badgeText).toBe('$50 bonus')
    expect(c?.ctaText).toBe('Get the bonus')
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
  })
})
