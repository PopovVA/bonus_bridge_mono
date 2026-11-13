import { describe, expect, it } from 'vitest'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'
import { buildLlmsTxt } from './llms-txt'

describe('llms.txt', () => {
  it('describes the site and lists the same paths as the sitemap', async () => {
    const paths = await listPublicSitemapPaths()
    const text = buildLlmsTxt(paths)
    expect(text.startsWith('# BonusBridge')).toBe(true)
    expect(text).toContain('Apis Systems LLC')
    expect(text).toContain('independent comparison and guide site')
    expect(text).toContain('https://bonusbridge.io/stores/rakuten')
    expect(text).toContain('https://bonusbridge.io/guides/chime-referral-requirements')
    expect(text).not.toContain('/stores/lemonade')
    expect(text).not.toContain('/stores/visible')
    expect(text).not.toContain('/stores/amex-hilton-honors')
    expect(text).not.toContain('/categories/travel')
    expect(text).not.toContain('/stores/public')
    expect(text).not.toContain('/categories/food')
    expect(text).not.toContain('\u2014')
    expect(text).not.toContain('\u2013')
    expect(buildLlmsTxt([])).not.toContain('https://bonusbridge.io/stores/')
  })
})
