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
  headline: 'Get up to $125 when you open Chime',
  promoHighlight: 'Tap the button to open the offer.',
  subtext: 'Terms apply.',
  termsLabel: 'View terms',
  termsUrl: 'https://example.com/terms',
  referralUrl: 'https://www.chime.com/r/test/',
  ctaText: 'Get your $125'
}

const imageSlide: HeroSlide = {
  kind: 'image',
  id: '550e8400-e29b-41d4-a716-446655440011',
  sortOrder: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  imageUrl: 'https://example.com/hero.jpg'
}

describe('HeroSlider', () => {
  it('renders full-width Chime panel, CTA link, carousel bar', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<HeroSlider slides={[chimeSlide, imageSlide]} />)
    expect(html).toContain('hero-chime-panel')
    expect(html).toContain('hero-slide-cell--chime')
    expect(html).toContain('Get up to ')
    expect(html).toContain('$125')
    expect(html).toContain('hero-chime-cta-primary')
    expect(html).toContain('href="https://www.chime.com/r/test/"')
    expect(html).not.toContain('hero-chime-side')
    expect(html).not.toContain('hero-chime-url-input')
    expect(html).not.toContain('copy-btn')
    expect(html).toContain('hero.jpg')
  })

  it('returns null when no slides', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<HeroSlider slides={[]} />)).toBe('')
  })
})
