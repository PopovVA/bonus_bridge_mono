import { describe, expect, it } from 'vitest'
import {
  getCategories,
  getFeaturedOffers,
  getFeaturedStores,
  getHeroSlides,
  getHomeCategoryMarquee,
  getHomeClipCoupons,
  getHotCashbackOffers,
  getTopMonthlyOffers,
  getOfferById,
  getOffers,
  getServiceBySlug,
  getServices,
  getStoresMegaMenu,
  megaMenuStoreImageSrc,
  sortServicesForCategorySlug
} from './site-data'

describe('site-data', () => {
  it('returns categories in alphabetical order by name', async () => {
    const list = await getCategories()
    expect(list.length).toBe(6)
    const names = list.map((c) => c.name)
    expect([...names].sort((a, b) => a.localeCompare(b, 'en'))).toEqual(names)
    expect(list[0]).toMatchObject({ slug: 'auto', name: 'Auto' })
    expect(list.map((c) => c.slug)).toEqual([
      'auto',
      'electronics',
      'finance',
      'food',
      'shopping',
      'travel'
    ])
  })

  it('returns top monthly offers for home', async () => {
    const list = await getTopMonthlyOffers()
    expect(list).toHaveLength(3)
    expect(list[0]?.slug).toBe('klarna')
    expect(list[0]?.href).toContain('klarna.com')
    expect(list[0]?.logoSrc).toBe('/top-offers/logos/klarna-logo.svg')
    expect(list[0]?.imageSrc).toBe('/top-offers/media/klarna-promo.png')
    expect(list[0]?.badgeText).toBe('20$ off')
    expect(list[1]?.slug).toBe('robinhood')
    expect(list[1]?.href).toContain('join.robinhood.com')
    expect(list[1]?.logoSrc).toBe('/clip-coupons/robinhood.svg')
    expect(list[1]?.imageSrc).toBe('/top-offers/media/robinhood-promo.png')
    expect(list[1]?.badgeText).toBe('$5+ stock')
    expect(list[2]?.slug).toBe('public')
    expect(list[2]?.logoSrc).toBe('/top-offers/logos/public-logo.svg')
    expect(list[2]?.imageSrc).toBe('/top-offers/media/public-promo.png')
    expect(list[2]?.badgeText).toBe('20$ off')
  })

  it('returns home clip coupons (8 tear-off promos)', async () => {
    const list = await getHomeClipCoupons()
    expect(list).toHaveLength(8)
    const ue = list.find((c) => c.id === 'clip-ubereats')
    expect(ue?.code).toBe('eats-zywrn58e0v')
    expect(ue?.openUrl).toContain('ubereats.com')
    expect(ue?.openUrl).toContain('promoCode=eats-zywrn58e0v')
    expect(ue?.logoSrc).toBe('/brands/ubereats-logo.png')
    const rides = list.find((c) => c.id === 'clip-uber-rides')
    expect(rides?.code).toBe('zfj232q2gjsx')
    expect(rides?.openUrl).toContain('referrals.uber.com')
    expect(rides?.openUrl).toContain('zfj232q2gjsx')
    expect(rides?.logoSrc).toBe('/brands/uber-logo.png')
    const seven = list.find((c) => c.id === 'clip-7now')
    expect(seven?.code).toBe('my1w2j')
    expect(seven?.openUrl).toBe('https://smart.link/370flfia27552?cp_0=my1w2j')
    expect(seven?.logoSrc).toBe('/clip-coupons/7eleven.svg')
    const lyft = list.find((c) => c.id === 'clip-lyft')
    expect(lyft?.code).toBe('VADIM53422')
    expect(lyft?.openUrl).toBe('https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc')
    expect(lyft?.logoSrc).toBe('/clip-coupons/lyft.svg')
    const rh = list.find((c) => c.id === 'clip-robinhood')
    expect(rh?.code).toBe('vadimp-4f32ef3')
    expect(rh?.openUrl).toBe('https://join.robinhood.com/vadimp-4f32ef3')
    expect(rh?.logoSrc).toBe('/clip-coupons/robinhood.svg')
    const lime = list.find((c) => c.id === 'clip-lime')
    expect(lime?.code).toBe('REGUD7BFJWT')
    expect(lime?.openUrl).toBe('https://lime.bike/referral_signin/REGUD7BFJWT')
    expect(lime?.logoSrc).toBe('/clip-coupons/lime.svg')
    const bird = list.find((c) => c.id === 'clip-bird')
    expect(bird?.code).toBe('X86GGD')
    expect(bird?.openUrl).toBe('https://links.bird.co/rKbyq2')
    expect(bird?.logoSrc).toBe('/clip-coupons/bird.svg')
    const posh = list.find((c) => c.id === 'clip-poshmark')
    expect(posh?.code).toBe('VADIMPOPOV')
    expect(posh?.openUrl).toBe('https://posh.mk/QW6tN2UJW1b')
    expect(posh?.logoSrc).toBe('/clip-coupons/poshmark.svg')
  })

  it('returns hot cashback offers for home', async () => {
    const list = await getHotCashbackOffers()
    expect(list).toHaveLength(4)
    expect(list[0]?.slug).toBe('rakuten')
    expect(list[0]?.badgeText).toBe('$50 bonus')
    expect(list[0]?.href).toBe('https://www.rakuten.com/r/MVADIM7')
    expect(list[1]?.slug).toBe('topcashback')
    expect(list[1]?.badgeText).toBe('$40 cashback')
    expect(list[1]?.href).toBe('https://www.topcashback.com/ref/member344836925437')
    expect(list[2]?.slug).toBe('honey')
    expect(list[2]?.badgeText).toBe('$10 cashback')
    expect(list[2]?.href).toBe('https://www.joinhoney.com/ref/nwpz6sw')
    expect(list[3]?.slug).toBe('lemonade')
    expect(list[3]?.badgeText).toBe('$10 gift card')
    expect(list[3]?.href).toBe('https://lemonade.com/r/vadimpopov1')
  })

  it('returns home category marquee chips in alphabetical order', async () => {
    const chips = await getHomeCategoryMarquee()
    expect(chips.length).toBe(6)
    expect(chips[0]?.slug).toBe('auto')
    expect(chips[0]?.imageSrc).toBe('/categories/auto.svg')
    expect(chips[0]?.href).toBe('/categories/auto')
    expect(chips.find((c) => c.slug === 'food')?.name).toBe('Food')
    const names = chips.map((c) => c.name)
    expect([...names].sort((a, b) => a.localeCompare(b, 'en'))).toEqual(names)
  })

  it('returns stores mega menu categories A–Z with store icons', async () => {
    const menu = await getStoresMegaMenu()
    expect(menu.categories.length).toBe(6)
    expect(menu.categories[0]?.slug).toBe('auto')
    expect(menu.categories[0]?.imageSrc).toBe('/categories/auto.svg')
    expect(menu.categories.find((c) => c.slug === 'food')?.imageSrc).toBe('/categories/food.svg')
    const menuNames = menu.categories.map((c) => c.name)
    expect([...menuNames].sort((a, b) => a.localeCompare(b, 'en'))).toEqual(menuNames)
    expect(menu.storesByCategorySlug.auto?.map((s) => s.slug)).toEqual([
      'uber',
      'lyft',
      'lime',
      'bird',
      'lemonade'
    ])
    expect(menu.storesByCategorySlug.auto?.[0]?.imageSrc).toBe('/brands/uber-logo.png')
    expect(menu.storesByCategorySlug.finance?.map((s) => s.slug)).toEqual([
      'chime',
      'robinhood',
      'public',
      'klarna',
      'lemonade'
    ])
    expect(menu.storesByCategorySlug.shopping?.map((s) => s.slug)).toEqual([
      'poshmark',
      'rakuten',
      'topcashback',
      'honey'
    ])
    expect(menu.storesByCategorySlug.travel?.map((s) => s.slug)).toEqual(['airbnb'])
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
    expect(fs[0]?.store?.slug).toBe('uber')
  })

  it('returns featured offers with nested offer', async () => {
    const fo = await getFeaturedOffers()
    expect(fo[0]?.offer?.referralUrl).toMatch(/^https?:\/\//)
  })

  it('filters services by category slug and query', async () => {
    const finance = await getServices({ category: 'finance' })
    expect(finance.map((s) => s.slug)).toEqual(['chime', 'robinhood', 'public', 'klarna', 'lemonade'])
    expect(finance.every((s) => s.categoryId === '11111111-1111-4111-8111-111111111101')).toBe(true)
    const auto = await getServices({ category: 'auto' })
    expect(auto.map((s) => s.slug)).toEqual(['uber', 'lyft', 'lime', 'bird', 'lemonade'])
    expect(auto.find((s) => s.slug === 'lemonade')?.categoryId).toBe('11111111-1111-4111-8111-111111111101')
    const q = await getServices({ q: 'Klarna' })
    expect(q.some((s) => s.slug === 'klarna')).toBe(true)
    const byDescription = await getServices({ q: 'Cash back' })
    expect(byDescription.some((s) => s.slug === 'topcashback')).toBe(true)
    const byInsurance = await getServices({ q: 'insurance' })
    expect(byInsurance.some((s) => s.slug === 'lemonade')).toBe(true)
  })

  it('resolves service by slug', async () => {
    const s = await getServiceBySlug('chime')
    expect(s.slug).toBe('chime')
    await expect(getServiceBySlug('missing-store')).rejects.toThrow()
  })

  it('filters offers by status, store slug, category', async () => {
    const active = await getOffers({ status: 'active' })
    expect(active.length).toBe(3)
    const byStore = await getOffers({ status: 'active', service: 'chime' })
    expect(byStore.every((o) => o.serviceId === '22222222-2222-4222-8222-222222222210')).toBe(true)
    const byCat = await getOffers({ status: 'active', category: 'finance' })
    expect(byCat.length).toBe(2)
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
    const found = await getOffers({ status: 'active', q: 'Klarna' })
    expect(found.some((o) => o.title.toLowerCase().includes('klarna'))).toBe(true)
    const byPreviewOnly = await getOffers({ status: 'active', q: 'qualifying' })
    expect(byPreviewOnly.some((o) => o.id === '33333333-3333-4333-8333-333333333301')).toBe(true)
  })

  it('resolves mega menu store image path with fallback', () => {
    expect(megaMenuStoreImageSrc({ logoSrc: '/brands/x.png' })).toBe('/brands/x.png')
    expect(megaMenuStoreImageSrc({ logoSrc: null })).toBe('/icon.svg')
    expect(megaMenuStoreImageSrc({})).toBe('/icon.svg')
  })

  it('sorts services with slugs missing from category order after known slugs', async () => {
    const uber = await getServiceBySlug('uber')
    const tail: typeof uber = {
      ...uber,
      id: '22222222-2222-4222-8222-222222222299',
      slug: 'z-tail-test',
      name: 'Z tail'
    }
    const sorted = sortServicesForCategorySlug('auto', [tail, uber])
    expect(sorted[0]?.slug).toBe('uber')
    expect(sorted[sorted.length - 1]?.slug).toBe('z-tail-test')
  })

  it('alphabetically sorts when category has no explicit store order (travel)', async () => {
    const airbnb = await getServiceBySlug('airbnb')
    const zed: typeof airbnb = {
      ...airbnb,
      id: '22222222-2222-4222-8222-222222222296',
      slug: 'zed-travel-test',
      name: 'Zed Travel Test'
    }
    const sorted = sortServicesForCategorySlug('travel', [zed, airbnb])
    expect(sorted.map((s) => s.name)).toEqual(['Airbnb', 'Zed Travel Test'])
  })

  it('sorts unknown slugs by name when both are outside category order', async () => {
    const uber = await getServiceBySlug('uber')
    const b: typeof uber = {
      ...uber,
      id: '22222222-2222-4222-8222-222222222297',
      slug: 'unknown-b',
      name: 'Beta'
    }
    const a: typeof uber = {
      ...uber,
      id: '22222222-2222-4222-8222-222222222298',
      slug: 'unknown-a',
      name: 'Alpha'
    }
    const sorted = sortServicesForCategorySlug('auto', [b, a])
    expect(sorted.map((s) => s.slug)).toEqual(['unknown-a', 'unknown-b'])
  })
})
