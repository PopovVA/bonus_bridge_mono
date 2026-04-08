import { describe, expect, it } from 'vitest'
import { buildStoreSearchIndex, filterStoresByQuery } from './store-name-search'
import type { ClientCatalogPayload } from './site-data'

const catalog: ClientCatalogPayload = {
  categories: [
    {
      slug: 'auto',
      name: 'Auto',
      stores: [
        { slug: 'uber', name: 'Uber', logoSrc: null, offers: [] },
        { slug: 'bird', name: 'Bird', logoSrc: null, offers: [] }
      ]
    },
    {
      slug: 'food',
      name: 'Food',
      stores: [
        { slug: 'uber-eats', name: 'Uber Eats', logoSrc: null, offers: [] },
        { slug: 'uber', name: 'Uber', logoSrc: null, offers: [] }
      ]
    }
  ]
}

describe('store-name-search', () => {
  it('dedupes by slug and sorts by name', () => {
    const rows = buildStoreSearchIndex(catalog)
    expect(rows.map((r) => r.slug)).toEqual(['bird', 'uber', 'uber-eats'])
  })

  it('returns empty for blank query', () => {
    const rows = buildStoreSearchIndex(catalog)
    expect(filterStoresByQuery(rows, '')).toEqual([])
    expect(filterStoresByQuery(rows, '   ')).toEqual([])
  })

  it('matches case-insensitive substring on name', () => {
    const rows = buildStoreSearchIndex(catalog)
    expect(filterStoresByQuery(rows, 'UBER').map((r) => r.slug)).toEqual(['uber', 'uber-eats'])
    expect(filterStoresByQuery(rows, 'eats').map((r) => r.slug)).toEqual(['uber-eats'])
  })

  it('respects limit', () => {
    const rows = buildStoreSearchIndex(catalog)
    expect(filterStoresByQuery(rows, 'u', 1)).toHaveLength(1)
  })
})
