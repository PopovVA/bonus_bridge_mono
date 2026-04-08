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
  it('renders many duplicated segments for wide-viewport infinite scroll + static fallback track', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<CategoryMarquee chips={chips} />)
    expect(html).toContain('category-marquee-section')
    expect(html).toContain('category-marquee-viewport')
    expect(html).toContain('category-marquee-track--animated')
    expect(html).toContain('category-marquee-track--static')
    const aCount = (html.match(/href="\/categories\/a"/g) ?? []).length
    /* 10 animated copies + 1 static row (DOM always includes both) */
    expect(aCount).toBe(11)
  })

  it('returns null when no chips', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<CategoryMarquee chips={[]} />)).toBe('')
  })
})
