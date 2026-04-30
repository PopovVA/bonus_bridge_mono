import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { HotCashback } from './hot-cashback'

const sample = [
  {
    id: 'x1',
    brandName: 'Rakuten',
    slug: 'rakuten',
    badgeText: 'Terms apply',
    headline: 'Rakuten offer details and eligibility',
    description: 'Learn about Rakuten new-member offer details, qualifying spend requirements, and current provider terms.',
    ctaText: 'See offer details',
    href: 'https://www.rakuten.com/r/MVADIM7',
    logoSrc: '/hot-cashback/logos/rakuten.svg'
  }
]

describe('HotCashback', () => {
  it('renders section, badge, logo, CTA', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<HotCashback offers={sample} />)
    expect(html).toContain('hot-cashback-section')
    expect(html).toContain('Partner offer guides')
    expect(html).toContain('Terms apply')
    expect(html).toContain('clip-coupon-card__brand')
    expect(html).toContain('RAKUTEN')
    expect(html).toContain('Rakuten offer details and eligibility')
    expect(html).toContain('Learn about Rakuten new-member offer details')
    expect(html).toContain('Learn how each offer works, then confirm eligibility and terms on the provider site.')
    expect(html).toContain('href="https://www.rakuten.com/r/MVADIM7"')
    expect(html).toContain('hot-cashback-card__badge-icon')
    expect(html).toContain('/hot-cashback/logos/rakuten.svg')
  })


  it('supports custom heading/subtitle/id for store page reuse', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <HotCashback
        offers={sample}
        heading="Store Cashback"
        subtitle="Cashback for this store"
        sectionId="store-cashback"
      />
    )
    expect(html).toContain('id="store-cashback"')
    expect(html).toContain('Store Cashback')
    expect(html).toContain('Cashback for this store')
    expect(html).toContain('store-cashback-heading')
  })
  it('returns null when empty', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<HotCashback offers={[]} />)).toBe('')
  })
})
