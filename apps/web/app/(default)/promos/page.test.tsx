import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PromosPage, { metadata, PromosPageContent, revalidate } from './page'
import { parsePromos } from '@/lib/schemas/promo.schema'

describe('promos page', () => {
  it('ships an empty checked list with seo, disclosure, and breadcrumbs', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(revalidate).toBe(3600)
    expect(metadata.title).toBe('Promo codes and limited-time offers')
    expect(metadata.description).toContain("brand's official page")
    expect(metadata.alternates).toMatchObject({
      canonical: '/promos',
      types: { 'text/markdown': '/promos.md' }
    })
    expect(metadata.openGraph).toMatchObject({
      title: 'Promo codes and limited-time offers',
      url: 'https://bonusbridge.io/promos'
    })
    const html = renderToStaticMarkup(await PromosPage())
    expect(html).toContain('<h1')
    expect(html).toContain('No promo codes right now')
    expect(html).toContain('Browse guides')
    expect(html).toContain('href="/articles"')
    expect(html).toContain('BreadcrumbList')
    expect(html).toContain('independent comparison and guide site')
    expect(html).not.toContain('"@type":"Offer"')
    expect(html).not.toContain('promo-card')
  })

  it('orders active offers ahead of later and expired ones', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const items = parsePromos([
      {
        id: 'later-deal',
        store: 'Example Store',
        title: 'Later deal',
        code: null,
        description: 'A later checked offer.',
        terms: 'See the official page.',
        url: 'https://example.com/later',
        expiresAt: '2026-12-15T00:00:00Z',
        source: 'brand newsletter',
        checkedAt: '2026-11-01'
      },
      {
        id: 'soon-deal',
        store: 'Rakuten',
        storeSlug: 'rakuten',
        title: 'Soon deal',
        code: 'SOON',
        description: 'A soon checked offer.',
        terms: 'See the official page.',
        url: 'https://example.com/soon',
        expiresAt: '2026-11-20T00:00:00Z',
        source: 'brand newsletter',
        checkedAt: '2026-11-02',
        category: 'shopping'
      },
      {
        id: 'open-deal',
        store: 'Open Store',
        storeSlug: 'example-store',
        title: 'Open deal',
        code: null,
        description: 'An offer with no end date.',
        terms: 'See the official page.',
        url: 'https://example.com/open',
        expiresAt: null,
        source: 'brand newsletter',
        checkedAt: '2026-11-03'
      },
      {
        id: 'future-deal',
        store: 'Future Store',
        title: 'Future deal',
        description: 'An offer that has not started.',
        terms: 'See the official page.',
        url: 'https://example.com/future',
        startsAt: '2026-12-01T00:00:00Z',
        expiresAt: '2026-12-31T00:00:00Z',
        source: 'brand newsletter',
        checkedAt: '2026-11-04'
      },
      {
        id: 'gone-deal',
        store: 'Gone Store',
        title: 'Gone deal',
        code: 'GONE',
        description: 'An offer that ended.',
        terms: 'See the official page.',
        url: 'https://example.com/gone',
        expiresAt: '2026-01-02T00:00:00Z',
        source: 'brand newsletter',
        checkedAt: '2026-11-05'
      }
    ])
    const html = renderToStaticMarkup(
      <PromosPageContent
        items={items}
        now={new Date('2026-11-16T18:00:00.000Z')}
        knownSlugs={new Set(['rakuten'])}
      />
    )
    expect(html.indexOf('Soon deal')).toBeLessThan(html.indexOf('Later deal'))
    expect(html.indexOf('Later deal')).toBeLessThan(html.indexOf('Open deal'))
    expect(html.indexOf('Open deal')).toBeLessThan(html.indexOf('Future deal'))
    expect(html).toContain('href="/stores/rakuten"')
    expect(html).not.toContain('href="/stores/example-store"')
    expect(html).toContain('No set end date')
    expect(html).toContain('promo-card--expired')
    expect(html).toContain('Starts Dec 1, 2026, 12:00 AM UTC')
    expect(html).not.toContain('"@type":"Offer"')
  })
})
