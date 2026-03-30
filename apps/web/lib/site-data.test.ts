import { describe, expect, it } from 'vitest'
import {
  getCategories,
  getFeaturedOffers,
  getFeaturedStores,
  getHeroSlides,
  getOfferById,
  getOffers,
  getPremiumBanner,
  getServiceBySlug,
  getServices
} from './site-data'

describe('site-data', () => {
  it('returns categories', async () => {
    const list = await getCategories()
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]).toMatchObject({ slug: expect.any(String), name: expect.any(String) })
  })

  it('returns hero slides and premium banner', async () => {
    const heroes = await getHeroSlides()
    expect(heroes.length).toBeGreaterThan(0)
    expect(heroes[0]?.kind).toBe('chime')
    expect(heroes[1]?.kind).toBe('coinbase')
    if (heroes[0]?.kind === 'chime') {
      expect(heroes[0].headline).toContain('$125')
      expect(heroes[0].referralUrl).toContain('chime.com')
    }
    if (heroes[1]?.kind === 'coinbase') {
      expect(heroes[1].referralUrl).toContain('coinbase.com')
    }
    const banner = await getPremiumBanner()
    expect(banner?.title).toBeTruthy()
  })

  it('returns featured stores with nested store', async () => {
    const fs = await getFeaturedStores()
    expect(fs[0]?.store?.slug).toBeTruthy()
  })

  it('returns featured offers with nested offer', async () => {
    const fo = await getFeaturedOffers()
    expect(fo[0]?.offer?.referralUrl).toMatch(/^https?:\/\//)
  })

  it('filters services by category slug and query', async () => {
    const finance = await getServices({ category: 'finance' })
    expect(finance.every((s) => s.categoryId === '11111111-1111-4111-8111-111111111101')).toBe(true)
    const q = await getServices({ q: 'Acme' })
    expect(q.some((s) => s.name.includes('Acme'))).toBe(true)
    const byDescription = await getServices({ q: 'Cashback' })
    expect(byDescription.some((s) => s.slug === 'acme-cash')).toBe(true)
    const noDesc = await getServices({ q: 'No Desc' })
    expect(noDesc.some((s) => s.slug === 'no-desc-mart')).toBe(true)
  })

  it('resolves service by slug', async () => {
    const s = await getServiceBySlug('acme-cash')
    expect(s.slug).toBe('acme-cash')
    await expect(getServiceBySlug('missing-store')).rejects.toThrow()
  })

  it('filters offers by status, store slug, category', async () => {
    const active = await getOffers({ status: 'active' })
    expect(active.length).toBeGreaterThan(0)
    const byStore = await getOffers({ status: 'active', service: 'acme-cash' })
    expect(byStore.every((o) => o.serviceId === '22222222-2222-4222-8222-222222222201')).toBe(true)
    const byCat = await getOffers({ status: 'active', category: 'shopping' })
    expect(byCat.length).toBeGreaterThan(0)
  })

  it('returns offer by id or throws', async () => {
    const o = await getOfferById('33333333-3333-4333-8333-333333333301')
    expect(o.title).toBeTruthy()
    await expect(getOfferById('00000000-0000-4000-8000-000000000000')).rejects.toThrow()
  })

  it('returns empty lists for unknown filters', async () => {
    expect(await getServices({ category: 'no-such-category' })).toEqual([])
    expect(await getOffers({ status: 'active', service: 'no-such-store' })).toEqual([])
    expect(await getOffers({ status: 'active', category: 'no-such' })).toEqual([])
  })

  it('filters offers by search query', async () => {
    const found = await getOffers({ status: 'active', q: 'Acme' })
    expect(found.some((o) => o.title.includes('Acme'))).toBe(true)
  })
})
