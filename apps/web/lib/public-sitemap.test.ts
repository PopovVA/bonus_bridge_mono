import { describe, expect, it } from 'vitest'
import { unlistedStoreSlugs } from '@/lib/referral-programs'
import { lastModifiedForPath, listPublicSitemapPaths } from './public-sitemap'

describe('public sitemap paths', () => {
  it('includes guides and listed stores and omits unlisted programs', async () => {
    const paths = await listPublicSitemapPaths()
    expect(paths).toContain('/')
    expect(paths).toContain('/cookies')
    expect(paths).toContain('/disclosures')
    expect(paths).toContain('/guides/chime-referral-requirements')
    expect(paths).toContain('/promos')
    expect(paths).toContain('/guides/rakuten-referral-bonus-how-it-works')
    expect(paths).not.toContain('/guides/topcashback-referral-requirements')
    expect(paths).toContain('/stores/user-interviews')
    expect(paths).toContain('/categories/side-income')
    expect(paths).toContain('/stores/lyft')
    for (const slug of unlistedStoreSlugs()) {
      expect(paths).not.toContain(`/stores/${slug}`)
    }
  })

  it('sets lastmod only when a guide, article, or store has a real date', () => {
    expect(lastModifiedForPath('/guides/rakuten-referral-bonus-how-it-works')).toBe('2026-11-13T18:00:00.000Z')
    expect(lastModifiedForPath('/guides')).toBe('2026-11-13T18:00:00.000Z')
    expect(lastModifiedForPath('/guides/missing')).toBeUndefined()
    expect(lastModifiedForPath('/articles/chime-1000-two-friends')).toBe('2026-11-05T18:00:00.000Z')
    expect(lastModifiedForPath('/articles')).toBe('2026-11-05T18:00:00.000Z')
    expect(lastModifiedForPath('/articles/missing')).toBeUndefined()
    expect(lastModifiedForPath('/stores/user-interviews')).toBe('2026-11-16T12:00:00.000Z')
    expect(lastModifiedForPath('/stores/chime')).toBe('2026-11-09T12:00:00.000Z')
    expect(lastModifiedForPath('/stores/uber')).toBeUndefined()
    expect(lastModifiedForPath('/privacy-policy')).toBeUndefined()
    expect(lastModifiedForPath('/promos')).toBeUndefined()
  })
})
