import { describe, expect, it } from 'vitest'
import { unlistedStoreSlugs } from '@/lib/referral-programs'
import { listPublicSitemapPaths } from './public-sitemap'

describe('public sitemap paths', () => {
  it('includes guides and listed stores and omits unlisted programs', async () => {
    const paths = await listPublicSitemapPaths()
    expect(paths).toContain('/')
    expect(paths).toContain('/cookies')
    expect(paths).toContain('/disclosures')
    expect(paths).toContain('/guides/chime-referral-requirements')
    expect(paths).toContain('/stores/lyft')
    for (const slug of unlistedStoreSlugs()) {
      expect(paths).not.toContain(`/stores/${slug}`)
    }
  })
})
