import { describe, expect, it } from 'vitest'
import {
  getCategories,
  getFeaturedOffers,
  getFeaturedStores,
  getHeroSlides,
  getHomeCategoryMarquee,
  getTopMonthlyOffers,
  getOfferById,
  getOffers,
  getServiceBySlug,
  getServices
} from './site-data'

describe('site-data', () => {
  it('returns categories', async () => {
    const list = await getCategories()
    expect(list.length).toBe(10)
    expect(list[0]).toMatchObject({ slug: expect.any(String), name: expect.any(String) })
  })

  it('returns top monthly offers for home', async () => {
    const list = await getTopMonthlyOffers()
    expect(list).toHaveLength(3)
    expect(list[0]?.slug).toBe('klarna')
    expect(list[0]?.href).toContain('klarna.com')
    expect(list[0]?.logoSrc).toBe('/top-offers/logos/klarna-logo.svg')
    expect(list[0]?.imageSrc).toBe('/top-offers/media/klarna-promo.png')
    expect(list[0]?.badgeText).toBe('20$ off')
    expect(list[1]?.slug).toBe('public')
    expect(list[1]?.logoSrc).toBe('/top-offers/logos/public-logo.svg')
    expect(list[1]?.imageSrc).toBe('/top-offers/media/public-promo.png')
    expect(list[1]?.badgeText).toBe('20$ off')
    expect(list[2]?.slug).toBe('too-good-to-go')
    expect(list[2]?.href).toContain('tgtg.onelink.me')
    expect(list[2]?.logoSrc).toBe('/top-offers/logos/too-good-to-go-logo.svg')
    expect(list[2]?.imageSrc).toBe('/top-offers/media/too-good-to-go-promo.png')
    expect(list[2]?.badgeText).toBe('2$ off')
  })

  it('returns home category marquee chips in order', async () => {
    const chips = await getHomeCategoryMarquee()
    expect(chips.length).toBe(10)
    expect(chips[0]?.slug).toBe('finance')
    expect(chips[0]?.imageSrc).toBe('/categories/finance.svg')
    expect(chips[0]?.href).toContain('/stores?category=finance')
    expect(chips[2]?.slug).toBe('food-dining')
  })

  it('returns hero slides', async () => {
    const heroes = await getHeroSlides()
    expect(heroes.length).toBeGreaterThan(0)
    expect(heroes[0]?.kind).toBe('chime')
    expect(heroes[1]?.kind).toBe('uber')
    expect(heroes[2]?.kind).toBe('coinbase')
    expect(heroes[3]?.kind).toBe('paypal')
    if (heroes[0]?.kind === 'chime') {
      expect(heroes[0].headline).toContain('$125')
      expect(heroes[0].referralUrl).toContain('chime.com')
    }
    if (heroes[1]?.kind === 'uber') {
      expect(heroes[1].referralUrl).toContain('referrals.uber.com')
      expect(heroes[1].headline).toContain('$25')
    }
    if (heroes[2]?.kind === 'coinbase') {
      expect(heroes[2].referralUrl).toContain('coinbase.com')
    }
    if (heroes[3]?.kind === 'paypal') {
      expect(heroes[3].referralUrl).toContain('py.pl')
    }
    expect(heroes[4]?.kind).toBe('ubereats')
    if (heroes[4]?.kind === 'ubereats') {
      expect(heroes[4].referralUrl).toContain('ubereats.com')
      expect(heroes[4].referralUrl).toContain('promoCode=')
    }
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
