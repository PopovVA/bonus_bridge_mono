import React from 'react'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PromoBanner } from './promo-banner'

;(globalThis as { React?: typeof React }).React = React

describe('PromoBanner', () => {
  it('returns null when banner is null', () => {
    const html = renderToStaticMarkup(<PromoBanner banner={null} />)
    expect(html).toBe('')
  })

  it('renders banner with ctaHref as link', () => {
    const html = renderToStaticMarkup(
      <PromoBanner
        banner={{
          id: '1',
          title: 'Join Premium',
          description: 'Get deals',
          priceText: '$9.99',
          priceNote: 'First free',
          ctaText: 'Start',
          ctaHref: 'https://premium.example',
          createdAt: '',
          updatedAt: ''
        }}
      />
    )
    expect(html).toContain('Join Premium')
    expect(html).toContain('Get deals')
    expect(html).toContain('$9.99')
    expect(html).toContain('First free')
    expect(html).toContain('Start')
    expect(html).toContain('href="https://premium.example"')
  })

  it('renders banner without ctaHref using #premium fallback', () => {
    const html = renderToStaticMarkup(
      <PromoBanner
        banner={{
          id: '2',
          title: 'Deals',
          description: 'Desc',
          priceText: '$5',
          priceNote: null,
          ctaText: 'Try',
          ctaHref: null,
          createdAt: '',
          updatedAt: ''
        }}
      />
    )
    expect(html).toContain('Deals')
    expect(html).toContain('href="#premium"')
  })
})
