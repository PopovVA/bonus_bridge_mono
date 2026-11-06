import { describe, expect, it } from 'vitest'
import {
  assertGuideCatalog,
  definedGuides,
  formatGuideDate,
  getGuideBySlug,
  guideJsonLd,
  guideList,
  guidesForCategory,
  guidesForStore,
  type Guide
} from './guides'

function sample(overrides: Partial<Guide> = {}): Guide {
  const base = getGuideBySlug('rakuten-vs-topcashback')
  if (!base) throw new Error('missing base guide')
  return { ...base, ...overrides }
}

describe('guides', () => {
  it('publishes four unique titles within the search-result limit', () => {
    expect(guideList).toHaveLength(4)
    const titles = guideList.map((guide) => guide.metaTitle)
    expect(new Set(titles).size).toBe(4)
    for (const guide of guideList) {
      expect(guide.metaTitle.length).toBeLessThanOrEqual(60)
      expect(guide.h1.length).toBeGreaterThan(0)
    }
    expect(getGuideBySlug('missing-guide')).toBeUndefined()
    expect(assertGuideCatalog(guideList)).toBeUndefined()
  })

  it('links categories and stores to the guides that match them', () => {
    expect(guidesForCategory('shopping').map((guide) => guide.slug)).toContain('rakuten-vs-topcashback')
    expect(guidesForCategory('finance').map((guide) => guide.slug)).toContain('chime-referral-requirements')
    expect(guidesForCategory('travel')).toEqual([])
    expect(guidesForStore('rakuten').length).toBeGreaterThan(0)
    expect(guidesForStore('uber')).toEqual([])
    expect(definedGuides(['missing-guide', 'rakuten-vs-topcashback']).map((guide) => guide.slug)).toEqual([
      'rakuten-vs-topcashback'
    ])
  })

  it('formats dates and builds Article, FAQ, and breadcrumb JSON-LD', () => {
    expect(formatGuideDate('2026-11-05T18:00:00.000Z')).toBe('November 5, 2026')
    expect(formatGuideDate('not-a-date')).toBe('')
    const guide = getGuideBySlug('chime-referral-requirements')
    if (!guide) throw new Error('missing chime guide')
    const graph = guideJsonLd(guide)['@graph']
    expect(graph.map((node) => node['@type'])).toEqual(['BreadcrumbList', 'Article', 'FAQPage'])
  })

  it('rejects an invalid guide catalog', () => {
    const guide = sample()
    expect(() => assertGuideCatalog([guide, { ...guide }])).toThrow(/Duplicate/)
    expect(() => assertGuideCatalog([sample({ metaTitle: 'x'.repeat(61) })])).toThrow(/Title too long/)
    expect(() => assertGuideCatalog([sample({ description: 'too short' })])).toThrow(/Description/)
    expect(() => assertGuideCatalog([sample({ description: 'd'.repeat(171) })])).toThrow(/Description/)
    expect(() => assertGuideCatalog([sample({ faqs: [guide.faqs[0]!] })])).toThrow(/Need FAQs/)
    expect(() => assertGuideCatalog([sample({ sections: [guide.sections[0]!] })])).toThrow(/Need sections/)
    expect(() =>
      assertGuideCatalog([
        sample({ table: { caption: 'c', columns: ['Only'], rows: [['cell']] } })
      ])
    ).toThrow(/Need columns/)
    expect(() =>
      assertGuideCatalog([
        sample({ table: { caption: 'c', columns: ['A', 'B'], rows: [['only-one']] } })
      ])
    ).toThrow(/Row shape/)
    expect(() => assertGuideCatalog([sample({ outbound: [] })])).toThrow(/Need outbound/)
  })
})
