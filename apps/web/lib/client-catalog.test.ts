import { describe, expect, it } from 'vitest'
import { getStoreRelatedSections } from './client-catalog'
import type { ClientCatalogPayload } from './site-data'

const sample: ClientCatalogPayload = {
  categories: [
    {
      slug: 'electronics',
      name: 'Electronics',
      stores: [
        {
          slug: 'alpha',
          name: 'Alpha',
          logoSrc: null,
          offers: [
            {
              id: 'o1',
              serviceSlug: 'alpha',
              serviceName: 'Alpha',
              title: 'A deal',
              previewText: 'p',
              couponCode: null,
              referralUrl: 'https://a.com'
            }
          ]
        },
        {
          slug: 'beta',
          name: 'Beta',
          logoSrc: '/brands/beta.png',
          offers: [
            {
              id: 'o-beta',
              serviceSlug: 'beta',
              serviceName: 'Beta',
              title: 'Beta deal',
              previewText: 'peer',
              couponCode: null,
              referralUrl: 'https://beta.com'
            }
          ]
        }
      ]
    },
    {
      slug: 'food',
      name: 'Food',
      stores: [{ slug: 'solo', name: 'Solo', logoSrc: null, offers: [] }]
    },
    {
      slug: 'travel',
      name: 'Travel',
      stores: [
        {
          slug: 'air',
          name: 'AirCo',
          logoSrc: '/a.svg',
          offers: [{ id: 'ot', serviceSlug: 'air', serviceName: 'AirCo', title: 'Fly', previewText: 'x', couponCode: null, referralUrl: 'https://fly.com' }]
        }
      ]
    }
  ]
}

describe('getStoreRelatedSections', () => {
  it('returns empty when catalog has no categories', () => {
    expect(getStoreRelatedSections({ categories: [] }, 'alpha', null)).toEqual([])
  })

  it('orders primary category first, then two others (catalog slug order)', () => {
    const sections = getStoreRelatedSections(sample, 'alpha', 'electronics')
    /* Food has no offers from peers — block skipped. */
    expect(sections.map((s) => s.categorySlug)).toEqual(['electronics', 'travel'])
    expect(sections[0]?.otherStoreOffers).toHaveLength(1)
    expect(sections[0]?.otherStoreOffers[0]?.id).toBe('o-beta')
  })

  it('uses first category containing the store when primary slug is null', () => {
    const sections = getStoreRelatedSections(sample, 'alpha', null)
    expect(sections[0]?.categorySlug).toBe('electronics')
  })

  it('falls back when primary slug does not match a category that contains the store', () => {
    const sections = getStoreRelatedSections(sample, 'alpha', 'travel')
    expect(sections[0]?.categorySlug).toBe('electronics')
  })

  it('includes offers from other stores in the primary block', () => {
    const cat: ClientCatalogPayload = {
      categories: [
        {
          slug: 'x',
          name: 'X',
          stores: [
            {
              slug: 'a',
              name: 'A',
              logoSrc: null,
              offers: []
            },
            {
              slug: 'b',
              name: 'B',
              logoSrc: '/logos/b.png',
              offers: [
                {
                  id: 'ob',
                  serviceSlug: 'b',
                  serviceName: 'B',
                  title: 'B promo',
                  previewText: 'x',
                  couponCode: null,
                  referralUrl: 'https://b.com'
                }
              ]
            }
          ]
        },
        {
          slug: 'y',
          name: 'Y',
          stores: [{ slug: 'y1', name: 'Y1', logoSrc: null, offers: [] }]
        }
      ]
    }
    const sections = getStoreRelatedSections(cat, 'a', 'x')
    expect(sections[0]?.otherStoreOffers).toHaveLength(1)
    expect(sections[0]?.otherStoreOffers[0]).toMatchObject({
      id: 'ob',
      logoSrc: '/logos/b.png'
    })
    /* Category y has no offers — section omitted. */
    expect(sections.map((s) => s.categorySlug)).toEqual(['x'])
  })

  it('returns empty when the store is not in the catalog', () => {
    expect(getStoreRelatedSections(sample, 'unknown', 'electronics')).toEqual([])
  })

  it('in non-primary categories lists all stores when the current store is not in that category', () => {
    const sections = getStoreRelatedSections(sample, 'solo', 'food')
    /* Food is only “solo” with no peers/offers — block skipped; next two catalog categories are used. */
    expect(sections.map((s) => s.categorySlug)).toEqual(['electronics', 'travel'])
    expect(sections[0]?.otherStoreOffers.length).toBeGreaterThan(0)
  })

  it('skips empty category blocks but keeps later ones', () => {
    const minimal: ClientCatalogPayload = {
      categories: [
        {
          slug: 'only',
          name: 'Only',
          stores: [{ slug: 'me', name: 'Me', logoSrc: null, offers: [] }]
        },
        {
          slug: 'two',
          name: 'Two',
          stores: [
            {
              slug: 'x',
              name: 'X',
              logoSrc: null,
              offers: [{ id: '1', serviceSlug: 'x', serviceName: 'X', title: 'T', previewText: 'p', couponCode: null, referralUrl: 'https://x.com' }]
            }
          ]
        }
      ]
    }
    const sections = getStoreRelatedSections(minimal, 'me', 'only')
    expect(sections.map((s) => s.categorySlug)).toEqual(['two'])
  })
})
