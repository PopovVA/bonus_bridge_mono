import { describe, expect, it } from 'vitest'
import { homeStatsFromPaths } from '@/lib/home-stats'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'

describe('homeStatsFromPaths', () => {
  it('counts guide, store, and category pages only', () => {
    expect(
      homeStatsFromPaths([
        '/',
        '/articles',
        '/guides',
        '/articles/a',
        '/guides/b',
        '/stores/c',
        '/stores/d',
        '/categories/e',
        '/stores/c/extra'
      ])
    ).toEqual({ guides: 2, stores: 2, categories: 1 })
  })

  it('matches the published sitemap', async () => {
    const stats = homeStatsFromPaths(await listPublicSitemapPaths())
    expect(stats.guides).toBeGreaterThan(0)
    expect(stats.stores).toBeGreaterThan(0)
    expect(stats.categories).toBeGreaterThan(0)
  })
})
