import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('MOCK_NOT_FOUND')
  })
}))

import GuidesIndexPage from './page'
import GuidePage, { generateMetadata, generateStaticParams } from './[slug]/page'
import CookiesPage from '../cookies/page'
import DisclosuresPage from '../disclosures/page'

describe('guide and compliance routes', () => {
  it('lists comparison guides', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<GuidesIndexPage />)
    expect(html).toContain('Comparison guides')
    expect(html).toContain('/guides/rakuten-vs-topcashback')
    expect(html).toContain('<h1')
  })

  it('renders a guide with one h1, a table, and structured data', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      await GuidePage({ params: Promise.resolve({ slug: 'rakuten-vs-topcashback' }) })
    )
    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toContain('BreadcrumbList')
    expect(html).toContain('FAQPage')
    expect(html).toContain('guide-page__table')
    expect(html).toContain('independent comparison and guide site')
    expect(html).toContain('https://www.rakuten.com/r/MVADIM7')
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'how-cashback-signup-bonuses-work' }) })
    expect(meta.title).toEqual({ absolute: 'How Cashback Sign-Up Bonuses Work | BonusBridge' })
    const absolute = (meta.title as { absolute: string }).absolute
    expect(absolute.length).toBeLessThanOrEqual(60)
    expect(generateStaticParams().map((row) => row.slug)).toContain('best-cashback-portals-2026')
  })

  it('returns not found for an unknown guide', async () => {
    await expect(GuidePage({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow('MOCK_NOT_FOUND')
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).resolves.toMatchObject({
      title: 'Guide not found',
      robots: { index: false, follow: false }
    })
  })

  it('renders the cookie notice page and the disclosures page', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const cookies = renderToStaticMarkup(<CookiesPage />)
    expect(cookies).toContain('Cookie Notice')
    expect(cookies).toContain('TopCashback')
    expect(cookies).toContain('/privacy')
    const disclosures = renderToStaticMarkup(<DisclosuresPage />)
    expect(disclosures).toContain('How we vet referral programs')
    expect(disclosures).toContain('Rakuten')
    expect(disclosures).toContain('Official terms')
    expect(disclosures).toContain('Robinhood')
    expect(disclosures).not.toContain('vadimp-4f32ef3')
    expect(disclosures).toContain('November 5, 2026')
  })
})
