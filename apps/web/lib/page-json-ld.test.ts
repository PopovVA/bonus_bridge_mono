import { describe, expect, it } from 'vitest'
import { breadcrumbList, indexPageJsonLd } from './page-json-ld'

describe('page JSON-LD', () => {
  it('builds a breadcrumb list with absolute URLs', () => {
    const list = breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: '/guides' }
    ])
    expect(list['@type']).toBe('BreadcrumbList')
    expect(list.itemListElement[1]).toMatchObject({
      position: 2,
      name: 'Guides',
      item: 'https://bonusbridge.io/guides'
    })
  })

  it('defaults to a web page and omits optional fields', () => {
    const graph = indexPageJsonLd({
      path: '/contact',
      name: 'Contact',
      description: 'Email the site.'
    })
    const page = graph['@graph'][1] as { '@type': string; dateModified?: string; mainEntity?: unknown }
    expect(page['@type']).toBe('WebPage')
    expect(page.dateModified).toBeUndefined()
    expect(page.mainEntity).toBeUndefined()
    expect(graph['@graph'][0]).toMatchObject({ '@type': 'BreadcrumbList' })
  })

  it('adds a modified date and item list when provided', () => {
    const withDate = indexPageJsonLd({
      path: '/privacy-policy',
      name: 'Privacy Policy',
      description: 'How the site handles information.',
      dateModified: '2026-11-13T12:00:00.000Z'
    })
    expect((withDate['@graph'][1] as { dateModified: string }).dateModified).toBe('2026-11-13T12:00:00.000Z')

    const emptyItems = indexPageJsonLd({
      path: '/articles',
      name: 'Guides',
      description: 'Index',
      type: 'CollectionPage',
      items: []
    })
    expect((emptyItems['@graph'][1] as { mainEntity?: unknown }).mainEntity).toBeUndefined()

    const withItems = indexPageJsonLd({
      path: '/guides',
      name: 'Comparison guides',
      description: 'Guides',
      type: 'CollectionPage',
      items: [{ name: 'Rakuten vs TopCashback', path: '/guides/rakuten-vs-topcashback' }]
    })
    const page = withItems['@graph'][1] as {
      '@type': string
      mainEntity: { itemListElement: { url: string }[] }
    }
    expect(page['@type']).toBe('CollectionPage')
    expect(page.mainEntity.itemListElement[0]?.url).toBe('https://bonusbridge.io/guides/rakuten-vs-topcashback')
  })
})
