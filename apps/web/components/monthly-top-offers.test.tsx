import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MonthlyTopOffers } from './monthly-top-offers'

const baseOffer = {
  id: '550e8400-e29b-41d4-a716-446655440099',
  brandName: 'Klarna',
  slug: 'klarna',
  description: 'Desc',
  ctaText: 'Go',
  href: 'https://example.com/k',
  logoSrc: '/l.svg'
}

describe('MonthlyTopOffers', () => {
  it('renders grid and CTA', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <MonthlyTopOffers offers={[{ ...baseOffer, imageSrc: '/i.svg', badgeText: '20$ off' }]} />
    )
    expect(html).toContain('monthly-offers-section')
    expect(html).toContain('Top offers this month')
    expect(html).toContain('Desc')
    expect(html).toContain('href="https://example.com/k"')
    expect(html).toContain('monthly-offer-card__media-img')
    expect(html).not.toContain('monthly-offer-card__skeleton')
    expect(html).toContain('monthly-offer-card--has-badge')
    expect(html).toContain('monthly-offer-card__badge')
    expect(html).toContain('20$ off')
    expect(html).toContain('monthly-offer-card__badge-icon')
  })

  it('renders skeleton when imageSrc is omitted', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<MonthlyTopOffers offers={[baseOffer]} />)
    expect(html).toContain('monthly-offer-card__skeleton')
    expect(html).not.toContain('monthly-offer-card__media-img')
  })

  it('uses teal logo wrap for Too Good To Go', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <MonthlyTopOffers offers={[{ ...baseOffer, slug: 'too-good-to-go' }]} />
    )
    expect(html).toContain('monthly-offer-card__logo-wrap--tgtg')
  })

  it('uses contain + dark shell for Public wide promo art', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <MonthlyTopOffers offers={[{ ...baseOffer, slug: 'public', imageSrc: '/p.png' }]} />
    )
    expect(html).toContain('monthly-offer-card__media--public')
    expect(html).toContain('monthly-offer-card__media-img--public-contain')
  })

  it('returns null when empty', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<MonthlyTopOffers offers={[]} />)).toBe('')
  })
})
