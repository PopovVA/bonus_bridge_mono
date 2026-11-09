import { describe, expect, it } from 'vitest'
import { buildListingFacts, formatListingUpdated, isNotPubliclyPromoted } from './listing-facts'

describe('listing facts', () => {
  it('treats personal-only and unverified programs as not publicly promoted', () => {
    expect(isNotPubliclyPromoted('klarna')).toBe(true)
    expect(isNotPubliclyPromoted('public')).toBe(true)
    expect(isNotPubliclyPromoted('paypal')).toBe(true)
    expect(isNotPubliclyPromoted('uber')).toBe(true)
    expect(isNotPubliclyPromoted('lyft')).toBe(false)
    expect(isNotPubliclyPromoted('rakuten')).toBe(false)
  })

  it('formats a real timestamp and rejects empty or invalid values', () => {
    expect(formatListingUpdated(undefined)).toBeNull()
    expect(formatListingUpdated(null)).toBeNull()
    expect(formatListingUpdated('   ')).toBeNull()
    expect(formatListingUpdated('not-a-date')).toBeNull()
    expect(formatListingUpdated('2026-03-01T12:00:00.000Z')).toBe('March 1, 2026')
  })

  it('does not turn an unverified offer into a confirmed bonus', () => {
    const facts = buildListingFacts({
      slug: 'rakuten',
      terms: 'See Rakuten for eligibility and terms.',
      listingUpdatedAt: '2026-03-01T12:00:00.000Z'
    })
    expect(facts.reviewState).toBe('unverified')
    expect(facts.conditions).toContain('See Rakuten for eligibility and terms.')
    expect(facts.conditions).toContain('not verified')
    expect(facts.promotionNote).toBeNull()
    expect(facts.listingUpdatedLabel).toBe('March 1, 2026')
    expect(facts.region).toContain('not confirmed')
  })

  it('uses a generic conditions line when terms are missing', () => {
    const facts = buildListingFacts({ slug: 'lyft', terms: '   ', listingUpdatedAt: null })
    expect(facts.conditions).toContain('Eligibility and amounts are set by the provider')
    expect(facts.listingUpdatedLabel).toBeNull()
    expect(facts.promotionNote).toBeNull()
  })

  it('states that restricted programs are not publicly promoted without calling them unlawful', () => {
    const facts = buildListingFacts({
      slug: 'klarna',
      terms: 'Subject to approval.',
      listingUpdatedAt: '2026-03-01T12:00:00.000Z'
    })
    expect(facts.reviewState).toBe('not_publicly_promoted')
    expect(facts.conditions).not.toContain('Subject to approval.')
    expect(facts.promotionNote).toContain('not publicly promoting')
    expect(facts.promotionNote).toContain('not a statement that the service is unlawful')
    expect(facts.region).toContain('does not state where')
  })
})

describe('buildListingFacts quoted amount', () => {
  it('replaces the not-verified line when the page quotes an official amount', () => {
    const facts = buildListingFacts({ slug: 'chime', terms: 'Rules.', quotedAmountNote: 'The $100 above is quoted.' })
    expect(facts.conditions).toBe('Rules. The $100 above is quoted.')
    expect(facts.conditions).not.toContain('not verified')
    const noTerms = buildListingFacts({ slug: 'chime', quotedAmountNote: 'Quoted.' })
    expect(noTerms.conditions).toBe('Quoted.')
  })
})
