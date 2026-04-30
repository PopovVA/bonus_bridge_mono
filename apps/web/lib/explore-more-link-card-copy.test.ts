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
    expect(c?.badgeText).toBe('Terms apply')
    expect(c?.ctaText).toBe('Review Klarna terms')
    expect(c?.description).toBe(
      'Review Klarna availability, flexible payment details, and provider terms before continuing to the app.'
    )
    expect(c?.href).toContain('klarna.com')
    expect(c?.logoSrc).toBe('/top-offers/logos/klarna-logo.svg')
    expect(c?.headline).toBeNull()
  })

  it('uses partner-offer copy when slug is not in monthly row', () => {
    const c = getCuratedLinkCardCopyForExploreMore('rakuten')
    expect(c?.badgeText).toBe('Terms apply')
    expect(c?.ctaText).toBe('See offer details')
    expect(c?.headline).toBe('Rakuten offer details and eligibility')
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
