import { describe, expect, it } from 'vitest'
import {
  getCategories,
  getClientCatalog,
  getFeaturedOffers,
  getFeaturedStores,
  getHeroSlides,
  getHomeCategoryMarquee,
  getHomeClipCoupons,
  getAllHotCashbackOffers,
  getHotCashbackOffers,
  getMonthlyTopOfferForStoreSlug,
  getMonthlyTopOfferSnapshotBySlug,
  getTopMonthlyOffers,
  getOfferById,
  getOffers,
  getStoreSlugForOfferId,
  getServiceBySlug,
  getServices,
  serviceMatchesSearchQuery,
  getStoresMegaMenu,
  megaMenuStoreImageSrc,
  catalogLogoSrc,
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
    expect(list).toHaveLength(1)
    expect(list[0]?.slug).toBe('topcashback')
    expect(list[0]?.href).toBe('https://www.topcashback.com/ref/member344836925437')
    expect(list[0]?.logoSrc).toBe('/hot-cashback/logos/topcashback.png')
    expect(list[0]?.badgeText).toBe('Terms apply')
    expect(list[0]?.ctaText).toBe('Join TopCashback')
    expect(list[0]?.description).toContain('$10')
    expect(list[0]?.description).toContain('365 days')
  })

  it('exposes sync monthly top snapshot by slug (Explore More parity)', () => {
    const row = getMonthlyTopOfferSnapshotBySlug('topcashback')
    expect(row?.slug).toBe('topcashback')
    expect(row?.badgeText).toBe('Terms apply')
    expect(getMonthlyTopOfferSnapshotBySlug('klarna')).toBeUndefined()
    expect(getMonthlyTopOfferSnapshotBySlug('public')).toBeUndefined()
    expect(getMonthlyTopOfferSnapshotBySlug('robinhood')).toBeUndefined()
    expect(getMonthlyTopOfferSnapshotBySlug('unknown-slug-xyz')).toBeUndefined()
  })

  it('returns a monthly top offer only for slugs still on the home row', async () => {
    await expect(getMonthlyTopOfferForStoreSlug('topcashback')).resolves.toMatchObject({ slug: 'topcashback' })
    await expect(getMonthlyTopOfferForStoreSlug('klarna')).resolves.toBeNull()
    await expect(getMonthlyTopOfferForStoreSlug('public')).resolves.toBeNull()
    await expect(getMonthlyTopOfferForStoreSlug('uber')).resolves.toBeNull()
  })

  it('returns the home clip coupon for Lyft only', async () => {
    const list = await getHomeClipCoupons()
    expect(list.map((c) => c.id)).toEqual(['clip-lyft'])
    expect(list.some((c) => c.id === 'clip-visible')).toBe(false)
    const lyft = list.find((c) => c.id === 'clip-lyft')
    expect(lyft?.code).toBe('VADIM53422')
    expect(lyft?.openUrl).toBe('https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc')
    expect(lyft?.logoSrc).toBe('/clip-coupons/lyft.svg')
    expect(lyft?.blurb).toContain('market-specific')
    expect(list.some((c) => c.brand === 'Uber')).toBe(false)
  })

  it('returns hot cashback offers for home without the monthly duplicate', async () => {
    const list = await getHotCashbackOffers()
    expect(list.map((row) => row.slug)).toEqual(['rakuten', 'honey', 'chime'])
    expect(list[0]?.href).toBe('https://www.rakuten.com/r/MVADIM7')
    expect(list[1]?.href).toBe('https://www.joinhoney.com/ref/nwpz6sw')
    expect(list[2]?.href).toBe('https://www.chime.com/r/vadimpopov1/')
  })

  it('returns the full hot cashback list without unlisted referral cards', async () => {
    const list = await getAllHotCashbackOffers()
    expect(list).toHaveLength(4)
    expect(list.find((o) => o.slug === 'public')).toBeUndefined()
    expect(list.find((o) => o.slug === 'klarna')).toBeUndefined()
    expect(list.find((o) => o.slug === 'lemonade')).toBeUndefined()
    expect(list.find((o) => o.slug === 'topcashback')?.href).toContain('topcashback.com')
  })

  it('returns home category marquee chips in alphabetical order', async () => {
    const chips = await getHomeCategoryMarquee()
    expect(chips.map((c) => c.slug)).toEqual(['auto', 'electronics', 'finance', 'shopping'])
    expect(chips[0]?.imageSrc).toBe('/categories/auto.svg')
    expect(chips[0]?.href).toBe('/categories/auto')
    expect(chips.find((c) => c.slug === 'food')).toBeUndefined()
    const names = chips.map((c) => c.name)
    expect([...names].sort((a, b) => a.localeCompare(b, 'en'))).toEqual(names)
  })

  it('returns stores mega menu categories A–Z with store icons', async () => {
    const menu = await getStoresMegaMenu()
    expect(menu.categories.map((c) => c.slug)).toEqual(['auto', 'electronics', 'finance', 'shopping'])
    expect(menu.categories[0]?.imageSrc).toBe('/categories/auto.svg')
    expect(menu.categories.find((c) => c.slug === 'food')).toBeUndefined()
    const menuNames = menu.categories.map((c) => c.name)
    expect([...menuNames].sort((a, b) => a.localeCompare(b, 'en'))).toEqual(menuNames)
    expect(menu.storesByCategorySlug.auto?.map((s) => s.slug)).toEqual(['lyft'])
    expect(menu.storesByCategorySlug.auto?.[0]?.imageSrc).toBe('/clip-coupons/lyft.svg')
    expect(menu.storesByCategorySlug.finance?.map((s) => s.slug)).toEqual(['chime'])
    expect(menu.storesByCategorySlug.shopping?.map((s) => s.slug)).toEqual([
      'rakuten',
      'topcashback',
      'honey'
    ])
    expect(menu.storesByCategorySlug.food).toBeUndefined()
    expect(menu.storesByCategorySlug.travel).toBeUndefined()
    expect(menu.storesByCategorySlug.electronics?.map((s) => s.slug)).not.toContain('visible')
  })

  it('returns client catalog with stores and active offers per category', async () => {
    const catalog = await getClientCatalog()
    expect(catalog.categories.length).toBe(4)
    const finance = catalog.categories.find((c) => c.slug === 'finance')
    expect(finance?.stores.map((s) => s.slug)).toEqual(['chime'])
    const chime = finance?.stores.find((s) => s.slug === 'chime')
    expect(chime?.offers.some((o) => o.title.length > 0)).toBe(true)
    expect(chime?.offers[0]).toMatchObject({
      serviceSlug: 'chime',
      serviceName: 'Chime',
      referralUrl: 'https://www.chime.com/r/vadimpopov1/'
    })
    const lyft = catalog.categories.find((c) => c.slug === 'auto')?.stores.find((s) => s.slug === 'lyft')
    expect(lyft?.logoSrc).toBe('/clip-coupons/lyft.svg')
    expect(catalog.categories.find((c) => c.slug === 'food')).toBeUndefined()
    const slugs = catalog.categories.flatMap((category) => category.stores.map((store) => store.slug))
    expect(slugs).not.toContain('uber')
    expect(slugs).not.toContain('robinhood')
    expect(slugs).not.toContain('visible')
    expect(slugs).not.toContain('amex-hilton-honors')
  })

  it('returns hero slides for listed programs only', async () => {
    const heroes = await getHeroSlides()
    expect(heroes).toHaveLength(1)
    expect(heroes[0]?.kind).toBe('chime')
    if (heroes[0]?.kind === 'chime') {
      expect(heroes[0].headline).toBe('Chime referral requirements')
      expect(heroes[0].referralUrl).toContain('chime.com')
      expect(heroes[0].promoHighlight).toContain('10 successful referrals')
    }
    expect(heroes.some((slide) => slide.kind === 'paypal')).toBe(false)
    expect(heroes.some((slide) => slide.kind === 'uber')).toBe(false)
    expect(heroes.some((slide) => slide.kind === 'coinbase')).toBe(false)
  })

  it('returns featured stores with nested store', async () => {
    const fs = await getFeaturedStores()
    expect(fs[0]?.store?.slug).toBe('lyft')
    expect(fs[1]?.store?.slug).toBe('rakuten')
  })

  it('returns featured offers with nested offer', async () => {
    const fo = await getFeaturedOffers()
    expect(fo[0]?.offer?.referralUrl).toMatch(/^https?:\/\//)
  })

  it('serviceMatchesSearchQuery matches name, description, and treats null description as empty', () => {
    expect(serviceMatchesSearchQuery({ name: 'Acme Shop', description: 'Cash back deals' }, 'acme')).toBe(true)
    expect(serviceMatchesSearchQuery({ name: 'X', description: 'Cash back deals' }, 'cash')).toBe(true)
    expect(serviceMatchesSearchQuery({ name: 'NoDescBrand', description: null }, 'nodescbrand')).toBe(true)
    expect(serviceMatchesSearchQuery({ name: 'Other', description: 'alpha' }, 'zzz')).toBe(false)
  })

  it('filters services by category slug and query', async () => {
    const finance = await getServices({ category: 'finance' })
    expect(finance.map((s) => s.slug)).toEqual(['chime'])
    expect(finance.every((s) => s.categoryId === '11111111-1111-4111-8111-111111111101')).toBe(true)
    const auto = await getServices({ category: 'auto' })
    expect(auto.map((s) => s.slug)).toEqual(['lyft'])
    const q = await getServices({ q: 'Klarna' })
    expect(q.some((s) => s.slug === 'klarna')).toBe(false)
    const byDescription = await getServices({ q: 'Cash back' })
    expect(byDescription.some((s) => s.slug === 'topcashback')).toBe(true)
    const byDeposit = await getServices({ q: 'direct deposit' })
    expect(byDeposit.some((s) => s.slug === 'chime')).toBe(true)
  })

  it('resolves service by slug', async () => {
    const s = await getServiceBySlug('chime')
    expect(s.slug).toBe('chime')
    await expect(getServiceBySlug('missing-store')).rejects.toThrow()
  })

  it('filters offers by status, store slug, category', async () => {
    const active = await getOffers({ status: 'active' })
    expect(active.length).toBe(6)
    const byStore = await getOffers({ status: 'active', service: 'chime' })
    expect(byStore.every((o) => o.serviceId === '22222222-2222-4222-8222-222222222210')).toBe(true)
    const byCat = await getOffers({ status: 'active', category: 'finance' })
    expect(byCat.length).toBe(1)
  })

  it('returns offer by id or throws', async () => {
    const o = await getOfferById('33333333-3333-4333-8333-333333333301')
    expect(o.title).toBeTruthy()
    await expect(getOfferById('00000000-0000-4000-8000-000000000000')).rejects.toThrow()
  })

  it('resolves store slug for offer id for coupon URL redirects', async () => {
    await expect(getStoreSlugForOfferId('33333333-3333-4333-8333-333333333304')).resolves.toBe('lyft')
    await expect(getStoreSlugForOfferId('00000000-0000-4000-8000-000000000000')).resolves.toBeNull()
    await expect(getStoreSlugForOfferId('33333333-3333-4333-8333-333333333399')).resolves.toBeNull()
  })

  it('returns empty lists for unknown filters', async () => {
    expect(await getServices({ category: 'no-such-category' })).toEqual([])
    expect(await getOffers({ status: 'active', service: 'no-such-store' })).toEqual([])
    expect(await getOffers({ status: 'active', category: 'no-such' })).toEqual([])
  })

  it('filters offers by search query', async () => {
    const found = await getOffers({ status: 'active', q: 'Lyft' })
    expect(found.some((o) => o.title.toLowerCase().includes('lyft'))).toBe(true)
    const byPreviewOnly = await getOffers({ status: 'active', q: 'qualifying' })
    expect(byPreviewOnly.some((o) => o.id === '33333333-3333-4333-8333-333333333301')).toBe(true)
  })

  it('resolves mega menu store image path with fallback', () => {
    expect(megaMenuStoreImageSrc({ logoSrc: '/brands/x.png' })).toBe('/brands/x.png')
    expect(megaMenuStoreImageSrc({ logoSrc: null })).toBe('/icon.svg')
    expect(megaMenuStoreImageSrc({})).toBe('/icon.svg')
  })

  it('normalizes catalog logos to null when missing', () => {
    expect(catalogLogoSrc('/hot-cashback/logos/rakuten.svg')).toBe('/hot-cashback/logos/rakuten.svg')
    expect(catalogLogoSrc(null)).toBeNull()
    expect(catalogLogoSrc(undefined)).toBeNull()
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
