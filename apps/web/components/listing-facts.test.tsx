import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ListingFacts } from './listing-facts'
import { buildListingFacts } from '@/lib/listing-facts'

describe('ListingFacts', () => {
  it('renders region, conditions, promotion note, and listing date', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ListingFacts
        facts={buildListingFacts({
          slug: 'public',
          listingUpdatedAt: '2026-03-01T12:00:00.000Z'
        })}
      />
    )
    expect(html).toContain('Region')
    expect(html).toContain('Conditions')
    expect(html).toContain('Public referral')
    expect(html).toContain('March 1, 2026')
    expect(html).toContain('not a date when a bonus was verified')
  })

  it('omits the promotion note and date when they are absent', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ListingFacts facts={buildListingFacts({ slug: 'uber', terms: null, listingUpdatedAt: null })} />
    )
    expect(html).not.toContain('Public referral')
    expect(html).not.toContain('Listing updated')
    expect(html).toContain('not verified')
  })
})
