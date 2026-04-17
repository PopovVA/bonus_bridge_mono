import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { HeroSlider } from './hero-slider'
import type { HeroSlide } from '@/lib/schemas'

const chimeSlide: HeroSlide = {
  kind: 'chime',
  id: '550e8400-e29b-41d4-a716-446655440010',
  sortOrder: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  headline: 'See up to $125 new-account bonus (Chime)',
  promoHighlight: 'Learn how to qualify — tap to continue to the official site.',
  subtext: 'Terms apply.',
  termsLabel: 'View terms',
  termsUrl: 'https://example.com/terms',
  referralUrl: 'https://www.chime.com/r/test/',
  ctaText: 'Continue to official site'
}

const paypalSlide: HeroSlide = {
  kind: 'paypal',
  id: '550e8400-e29b-41d4-a716-446655440011',
  sortOrder: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  headline: 'Earn with PayPal Rewards',
  subtext: 'Terms apply.',
  referralUrl: 'https://py.pl/test',
  ctaText: 'Open offer'
}

describe('HeroSlider', () => {
  it('renders full-width Chime panel, brand logos, CTA link, floating carousel controls', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<HeroSlider slides={[chimeSlide, paypalSlide]} />)
    expect(html).toContain('hero-carousel-shell')
    expect(html).toContain('hero-chime-panel')
    expect(html).toContain('hero-slide-cell--promo')
    expect(html).toContain('See up to ')
    expect(html).toContain('$125')
    expect(html).toContain('hero-chime-promo-highlight')
    expect(html).toContain('hero-chime-cta-primary')
    expect(html).toContain('href="https://www.chime.com/r/test/"')
    expect(html).not.toContain('hero-chime-side')
    expect(html).not.toContain('hero-chime-url-input')
    expect(html).not.toContain('copy-btn')
    expect(html).toContain('hero-floating-arrow')
    expect(html).toContain('hero-floating-dot')
    expect(html).toContain('vectorlogo.zone/logos/chimebank/')
    expect(html).toContain('vectorlogo.zone/logos/paypal/')
  })

  it('returns null when no slides', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<HeroSlider slides={[]} />)).toBe('')
  })
})
