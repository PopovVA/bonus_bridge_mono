import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { HotCashback } from './hot-cashback'

const sample = [
  {
    id: 'x1',
    brandName: 'Rakuten',
    slug: 'rakuten',
    badgeText: '$50 bonus',
    description: 'Register for up to $50 after qualifying spend—Rakuten pays cashback on partner stores.',
    ctaText: 'Get the bonus',
    href: 'https://www.rakuten.com/r/MVADIM7',
    logoSrc: '/hot-cashback/logos/rakuten.svg'
  }
]

describe('HotCashback', () => {
  it('renders section, badge, logo, CTA', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<HotCashback offers={sample} />)
    expect(html).toContain('hot-cashback-section')
    expect(html).toContain('Hot Cashback')
    expect(html).toContain('$50 bonus')
    expect(html).toContain('Register for up to $50 after qualifying spend—Rakuten pays cashback on partner stores.')
    expect(html).toContain('Sign up below—welcome offers and eligibility are set by each partner.')
    expect(html).toContain('href="https://www.rakuten.com/r/MVADIM7"')
    expect(html).toContain('hot-cashback-card__badge-icon')
    expect(html).toContain('/hot-cashback/logos/rakuten.svg')
  })

  it('returns null when empty', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<HotCashback offers={[]} />)).toBe('')
  })
})
