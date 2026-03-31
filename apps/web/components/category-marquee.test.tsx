import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CategoryMarquee } from './category-marquee'

const chips = [
  {
    slug: 'a',
    name: 'Alpha',
    imageSrc: '/categories/a.svg',
    href: '/categories/a'
  },
  {
    slug: 'b',
    name: 'Beta',
    imageSrc: '/categories/b.svg',
    href: '/categories/b'
  }
]

describe('CategoryMarquee', () => {
  it('renders duplicated track for CSS infinite scroll', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<CategoryMarquee chips={chips} />)
    expect(html).toContain('category-marquee-section')
    expect(html).toContain('category-marquee-viewport')
    expect(html).toContain('category-marquee-track')
    const aCount = (html.match(/href="\/categories\/a"/g) ?? []).length
    expect(aCount).toBe(2)
  })

  it('returns null when no chips', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<CategoryMarquee chips={[]} />)).toBe('')
  })
})
