import { describe, expect, it } from 'vitest'
import nextConfig from '../next.config'
import { getServiceBySlug } from '@/lib/site-data'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'
import { unlistedStoreSlugs } from '@/lib/referral-programs'
import { LEGACY_REDIRECTS, legacyRedirectDestination, legacyRedirectRules } from './legacy-redirects'

describe('legacy redirects', () => {
  it('sends removed catalog URLs to a live page with status 301', async () => {
    expect(legacyRedirectDestination('/stores/lemonade')).toBe('/categories/finance')
    expect(legacyRedirectDestination('/stores/uber')).toBe('/categories/auto')
    expect(legacyRedirectDestination('/stores/airbnb')).toBe('/disclosures')
    expect(legacyRedirectDestination('/stores/visible')).toBe('/categories/electronics')
    expect(legacyRedirectDestination('/stores/amex-hilton-honors')).toBe('/disclosures')
    expect(legacyRedirectDestination('/categories/travel')).toBe('/disclosures')
    expect(legacyRedirectDestination('/categories/food')).toBe('/categories/shopping')
    expect(legacyRedirectDestination('/categories/food-dining')).toBe('/categories/shopping')
    expect(legacyRedirectDestination('/stores/rakuten')).toBeNull()

    const rules = legacyRedirectRules()
    expect(rules.every((rule) => rule.statusCode === 301)).toBe(true)
    expect(new Set(rules.map((rule) => rule.source)).size).toBe(rules.length)

    const paths = await listPublicSitemapPaths()
    for (const rule of rules) {
      expect(paths).not.toContain(rule.source)
      expect(paths).toContain(rule.destination)
    }
  })

  it('covers every unlisted store that still has a record', async () => {
    for (const slug of unlistedStoreSlugs()) {
      try {
        await getServiceBySlug(slug)
      } catch {
        expect(LEGACY_REDIRECTS[`/stores/${slug}`]).toBeUndefined()
        continue
      }
      expect(LEGACY_REDIRECTS[`/stores/${slug}`]).toBeTruthy()
    }
    expect(LEGACY_REDIRECTS['/stores/paypal']).toBeUndefined()
    expect(LEGACY_REDIRECTS['/stores/coinbase']).toBeUndefined()
  })

  it('is the redirect table Next serves', async () => {
    const redirects = await nextConfig.redirects()
    for (const [source, destination] of Object.entries(LEGACY_REDIRECTS)) {
      expect(redirects).toContainEqual({ source, destination, statusCode: 301 })
    }
    expect(redirects.find((rule) => rule.source === '/categories/food-dining')).toMatchObject({
      destination: '/categories/shopping',
      statusCode: 301
    })
  })
})
