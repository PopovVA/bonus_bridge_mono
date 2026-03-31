/**
 * Fixed in-repo content for the public site. Edit this file to change copy, stores, and coupons.
 */
import {
  MonthlyTopOfferSchema,
  OffersListQuerySchema,
  type Category,
  type FeaturedOfferWithOffer,
  type FeaturedStoreWithStore,
  type HeroSlide,
  type MonthlyTopOffer,
  type Offer,
  type Service
} from '@/lib/schemas'
import type { z } from 'zod'
import { offerWithService, serviceWithCategory } from '@/lib/site-data-relations'
import { HOME_CLIP_COUPONS, type HomeClipCoupon } from '@/lib/home-clip-coupons'
import { HOT_CASHBACK_OFFERS, type HotCashbackOffer } from '@/lib/hot-cashback'

export type { HomeClipCoupon } from '@/lib/home-clip-coupons'
export type { HotCashbackOffer } from '@/lib/hot-cashback'

const ISO = '2026-03-01T12:00:00.000Z'

/** Canonical category list (home marquee, Stores mega menu, `/categories/[slug]`). Sorted A–Z by `name` when exposed via getters. */
const categories: Category[] = [
  {
    id: '11111111-1111-4111-8111-111111111109',
    name: 'Auto',
    slug: 'auto',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Finance',
    slug: 'finance',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    name: 'Food',
    slug: 'food',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    name: 'Shopping',
    slug: 'shopping',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    name: 'Travel',
    slug: 'travel',
    createdAt: ISO,
    updatedAt: ISO
  }
]

/** Display order for stores inside each category (mega menu + category pages). */
const CATEGORY_STORE_ORDER: Record<string, string[]> = {
  auto: ['uber', 'lyft', 'lime', 'bird', 'lemonade'],
  electronics: ['poshmark', 'rakuten', 'topcashback', 'honey'],
  finance: ['chime', 'robinhood', 'public', 'klarna', 'lemonade'],
  food: ['uber-eats', '7now'],
  shopping: ['poshmark', 'rakuten', 'topcashback', 'honey'],
  /* Empty order → alphabetical sort in `sortServicesForCategorySlug` (travel is a single store). */
  travel: []
}

function categoriesSortedAlphabetically(): Category[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

function serviceMatchesCategory(s: Service, cat: Category): boolean {
  if (s.categoryId === cat.id) return true
  const extra = s.extraCategorySlugs ?? []
  return extra.includes(cat.slug)
}

/** Exported for unit tests (unknown slug tail ordering). */
export function sortServicesForCategorySlug(categorySlug: string, list: Service[]): Service[] {
  if (list.length < 2) return [...list]
  const order = CATEGORY_STORE_ORDER[categorySlug]
  if (!order?.length) {
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'en'))
  }
  return [...list].sort((a, b) => {
    const ia = order.indexOf(a.slug)
    const ib = order.indexOf(b.slug)
    const ra = ia === -1 ? order.length + 1 : ia
    const rb = ib === -1 ? order.length + 1 : ib
    return ra - rb || a.name.localeCompare(b.name, 'en')
  })
}

export type HomeCategoryChip = {
  slug: string
  name: string
  imageSrc: string
  href: string
}

export type StoresMegaMenuCategory = {
  slug: string
  name: string
  /** Same tiles as the home category carousel: `public/categories/{slug}.svg`. */
  imageSrc: string
}

export type StoresMegaMenuStore = {
  slug: string
  name: string
  imageSrc: string
}

export type StoresMegaMenuPayload = {
  categories: StoresMegaMenuCategory[]
  storesByCategorySlug: Record<string, StoresMegaMenuStore[]>
}

const CAT = {
  auto: '11111111-1111-4111-8111-111111111109',
  electronics: '11111111-1111-4111-8111-111111111106',
  finance: '11111111-1111-4111-8111-111111111101',
  food: '11111111-1111-4111-8111-111111111103',
  shopping: '11111111-1111-4111-8111-111111111102',
  travel: '11111111-1111-4111-8111-111111111104'
} as const

const services: Service[] = [
  {
    id: '22222222-2222-4222-8222-222222222201',
    name: 'Uber',
    slug: 'uber',
    categoryId: CAT.auto,
    website: 'https://www.uber.com/',
    description: 'Rides and mobility.',
    logoSvg: undefined,
    logoSrc: '/brands/uber-logo.png',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222202',
    name: 'Lyft',
    slug: 'lyft',
    categoryId: CAT.auto,
    website: 'https://www.lyft.com/',
    description: 'Rideshare rewards and referrals.',
    logoSvg: undefined,
    logoSrc: '/clip-coupons/lyft.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222203',
    name: 'Lime',
    slug: 'lime',
    categoryId: CAT.auto,
    website: 'https://www.li.me/',
    description: 'E-scooter and bike sharing.',
    logoSvg: undefined,
    logoSrc: '/clip-coupons/lime.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222204',
    name: 'Bird',
    slug: 'bird',
    categoryId: CAT.auto,
    website: 'https://www.bird.co/',
    description: null,
    logoSvg: undefined,
    logoSrc: '/clip-coupons/bird.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222205',
    name: 'Lemonade',
    slug: 'lemonade',
    categoryId: CAT.finance,
    extraCategorySlugs: ['auto'],
    website: 'https://www.lemonade.com/',
    description: 'Digital renters and home insurance with referrals.',
    logoSvg: undefined,
    logoSrc: '/hot-cashback/logos/lemonade.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222206',
    name: 'Poshmark',
    slug: 'poshmark',
    categoryId: CAT.electronics,
    extraCategorySlugs: ['shopping'],
    website: 'https://poshmark.com/',
    description: 'Resale fashion marketplace.',
    logoSvg: undefined,
    logoSrc: '/clip-coupons/poshmark.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222207',
    name: 'Rakuten',
    slug: 'rakuten',
    categoryId: CAT.electronics,
    extraCategorySlugs: ['shopping'],
    website: 'https://www.rakuten.com/',
    description: 'Cash back when you shop online.',
    logoSvg: undefined,
    logoSrc: '/hot-cashback/logos/rakuten.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222208',
    name: 'TopCashback',
    slug: 'topcashback',
    categoryId: CAT.electronics,
    extraCategorySlugs: ['shopping'],
    website: 'https://www.topcashback.com/',
    description: 'Cash back portal for thousands of retailers.',
    logoSvg: undefined,
    logoSrc: '/hot-cashback/logos/topcashback.png',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222209',
    name: 'PayPal Honey',
    slug: 'honey',
    categoryId: CAT.electronics,
    extraCategorySlugs: ['shopping'],
    website: 'https://www.joinhoney.com/',
    description: 'Automatic coupons and rewards.',
    logoSvg: undefined,
    logoSrc: '/hot-cashback/logos/honey.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222210',
    name: 'Chime',
    slug: 'chime',
    categoryId: CAT.finance,
    website: 'https://www.chime.com/',
    description: 'Mobile banking with referral bonuses.',
    logoSvg: undefined,
    logoSrc: '/stores/chime.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222211',
    name: 'Robinhood',
    slug: 'robinhood',
    categoryId: CAT.finance,
    website: 'https://robinhood.com/',
    description: 'Investing and stock rewards.',
    logoSvg: undefined,
    logoSrc: '/clip-coupons/robinhood.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222212',
    name: 'Public',
    slug: 'public',
    categoryId: CAT.finance,
    website: 'https://public.com/',
    description: 'Social investing.',
    logoSvg: undefined,
    logoSrc: '/top-offers/logos/public-logo.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222213',
    name: 'Klarna',
    slug: 'klarna',
    categoryId: CAT.finance,
    website: 'https://www.klarna.com/',
    description: 'Shop now, pay later.',
    logoSvg: undefined,
    logoSrc: '/top-offers/logos/klarna-logo.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222214',
    name: 'Uber Eats',
    slug: 'uber-eats',
    categoryId: CAT.food,
    website: 'https://www.ubereats.com/',
    description: 'Food delivery promos and first-order deals.',
    logoSvg: undefined,
    logoSrc: '/brands/ubereats-logo.png',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222215',
    name: '7NOW Delivery',
    slug: '7now',
    categoryId: CAT.food,
    website: 'https://www.7-eleven.com/',
    description: '7NOW delivery and convenience offers.',
    logoSvg: undefined,
    logoSrc: '/clip-coupons/7eleven.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222216',
    name: 'Airbnb',
    slug: 'airbnb',
    categoryId: CAT.travel,
    website: 'https://www.airbnb.com/',
    description: 'Stays and experiences.',
    logoSvg: undefined,
    logoSrc: '/stores/airbnb.svg',
    createdAt: ISO,
    updatedAt: ISO
  }
]

const offers: Offer[] = [
  {
    id: '33333333-3333-4333-8333-333333333301',
    serviceId: '22222222-2222-4222-8222-222222222210',
    title: 'Get up to $125 when you open Chime',
    previewText: 'New account + qualifying direct deposit — see Chime for current terms.',
    couponCode: null,
    bonusAmount: '$125',
    description: 'Referral bonus when you qualify.',
    referralUrl: 'https://www.chime.com/r/vadimpopov1/',
    terms: 'Eligibility and amounts follow Chime.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    serviceId: '22222222-2222-4222-8222-222222222213',
    title: 'Shop now with Klarna',
    previewText: 'Flexible payments at checkout — open Klarna with our invite.',
    couponCode: null,
    bonusAmount: null,
    description: 'Pay over time where available.',
    referralUrl: 'https://invite.klarna.com/us/n33cxpeu/default-us',
    terms: 'Subject to Klarna approval.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333399',
    serviceId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    title: 'Detached offer row',
    previewText: 'No matching store id — omitted from category listings.',
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: 'https://example.com',
    terms: null,
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  }
]

const heroSlides: HeroSlide[] = [
  {
    kind: 'chime',
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    sortOrder: 0,
    createdAt: ISO,
    updatedAt: ISO,
    eyebrow: 'Limited-time bank bonus',
    headline: 'Get up to $125 when you open Chime',
    promoHighlight: 'New account + qualifying direct deposit — tap the button to start in one step.',
    subtext: "Eligibility and amounts follow Chime's current offer; friends may qualify separately.",
    termsLabel: 'View terms',
    termsUrl: 'https://www.chime.com/legal/all-policies/',
    referralUrl: 'https://www.chime.com/r/vadimpopov1/',
    ctaText: 'Get your $125'
  },
  {
    kind: 'uber',
    id: 'ffffffff-ffff-4fff-8fff-fffffffffff1',
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO,
    eyebrow: 'Uber referral',
    headline: 'Get $25 off your first 2 rides',
    promoHighlight:
      'New to Uber? Use our link — errands, appointments, or visiting friends, without the parking hassle. The discount applies when you sign up through the button below.',
    subtext:
      "Uber is a simple, reliable way to get where you need to go. Savings and eligibility follow Uber's current referral offer and terms.",
    termsLabel: 'Uber terms & help',
    termsUrl: 'https://www.uber.com/legal/',
    referralUrl: 'https://referrals.uber.com/refer?id=zfj232q2gjsx',
    ctaText: 'Ride with $25 off'
  },
  {
    kind: 'coinbase',
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccc01',
    sortOrder: 2,
    createdAt: ISO,
    updatedAt: ISO,
    eyebrow: 'Limited-time crypto offer',
    headline: 'Get up to $200 in crypto when you join Coinbase',
    promoHighlight:
      'Open through our link, then buy or trade — bonuses stack as Coinbase\'s promos allow.',
    subtext: 'Reward caps and who qualifies are set by Coinbase. Read their latest terms before you trade.',
    termsLabel: 'View terms',
    termsUrl: 'https://www.coinbase.com/legal',
    referralUrl: 'https://coinbase.com/join/F2XRWRL?src=ios-link',
    ctaText: 'Open Coinbase & earn'
  },
  {
    kind: 'paypal',
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    sortOrder: 3,
    createdAt: ISO,
    updatedAt: ISO,
    eyebrow: 'PayPal Rewards offer',
    headline: 'Earn up to $100 in cash back with PayPal Rewards',
    promoHighlight:
      'Our link opens the offer — points toward cash after setup and a small qualifying checkout.',
    subtext:
      'Usually: linked bank or card, verified phone, and a $5+ PayPal checkout within 30 days. Limits are set by PayPal.',
    termsLabel: 'View terms',
    termsUrl: 'https://www.paypal.com/us/legalhub/paypal/referral-program',
    referralUrl: 'https://py.pl/29jzHS',
    ctaText: 'Open the PayPal offer'
  },
  {
    kind: 'ubereats',
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeee01',
    sortOrder: 4,
    createdAt: ISO,
    updatedAt: ISO,
    eyebrow: 'First order on Uber Eats',
    headline: 'Get $20 off your next delivery orders',
    promoHighlight:
      'New to Uber Eats? Place your first delivery order today — tap below to open Uber Eats with this offer applied.',
    subtext:
      'Delivery orders; minimum spend, eligibility, and expiry follow Uber Eats. Terms apply.',
    termsLabel: 'Offer terms',
    termsUrl: 'https://www.ubereats.com/legal',
    referralUrl: 'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
    ctaText: 'Order with $20 off'
  }
]

const featuredStores: FeaturedStoreWithStore[] = [
  {
    id: '44444444-4444-4444-8444-444444444401',
    storeId: services[0]!.id,
    sortOrder: 0,
    createdAt: ISO,
    updatedAt: ISO,
    store: serviceWithCategory(services[0]!, categories)
  },
  {
    id: '44444444-4444-4444-8444-444444444402',
    storeId: services[1]!.id,
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO,
    store: serviceWithCategory(services[1]!, categories)
  }
]

const featuredOffers: FeaturedOfferWithOffer[] = [
  {
    id: '66666666-6666-4666-8666-666666666601',
    offerId: offers[0]!.id,
    sortOrder: 0,
    createdAt: ISO,
    updatedAt: ISO,
    offer: offerWithService(offers[0]!, services, categories)
  },
  {
    id: '66666666-6666-4666-8666-666666666602',
    offerId: offers[1]!.id,
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO,
    offer: offerWithService(offers[1]!, services, categories)
  }
]

const monthlyTopOffers: MonthlyTopOffer[] = MonthlyTopOfferSchema.array().parse([
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01',
    brandName: 'Klarna',
    slug: 'klarna',
    description:
      'Shop now, pay later — open Klarna with our invite to explore deals, flexible payments, and rewards in the app.',
    ctaText: 'Open Klarna',
    href: 'https://invite.klarna.com/us/n33cxpeu/default-us',
    logoSrc: '/top-offers/logos/klarna-logo.svg',
    imageSrc: '/top-offers/media/klarna-promo.png',
    badgeText: '20$ off'
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
    brandName: 'Robinhood',
    slug: 'robinhood',
    description:
      'Gift stock after you sign up and meet funding rules. Many rewards are $5 to $10. Limits and terms on Robinhood.',
    ctaText: 'Claim your stock',
    href: 'https://join.robinhood.com/vadimp-4f32ef3',
    logoSrc: '/clip-coupons/robinhood.svg',
    imageSrc: '/top-offers/media/robinhood-promo.png',
    badgeText: '$5+ stock'
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa03',
    brandName: 'Public',
    slug: 'public',
    description:
      'Invest with friends on Public. Join through our link for a welcome bonus when you qualify — stocks, ETFs, and more.',
    ctaText: 'Join Public',
    href: 'https://share.public.com/Vadim66923',
    logoSrc: '/top-offers/logos/public-logo.svg',
    imageSrc: '/top-offers/media/public-promo.png',
    badgeText: '20$ off'
  }
])

export async function getCategories(): Promise<Category[]> {
  return structuredClone(categoriesSortedAlphabetically())
}

export async function getHomeCategoryMarquee(): Promise<HomeCategoryChip[]> {
  return categoriesSortedAlphabetically().map((c) => ({
    slug: c.slug,
    name: c.name,
    imageSrc: `/categories/${c.slug}.svg`,
    href: `/categories/${encodeURIComponent(c.slug)}`
  }))
}

/** Logo path for header mega menu rows when `logoSrc` is missing in static data. */
export function megaMenuStoreImageSrc(service: Pick<Service, 'logoSrc'>): string {
  return service.logoSrc ?? '/icon.svg'
}

/** Categories A–Z, plus stores per category slug (for header mega menu). */
export async function getStoresMegaMenu(): Promise<StoresMegaMenuPayload> {
  const sorted = categoriesSortedAlphabetically()
  const marqueeCategories: StoresMegaMenuCategory[] = sorted.map((c) => ({
    slug: c.slug,
    name: c.name,
    imageSrc: `/categories/${c.slug}.svg`
  }))
  const storesByCategorySlug: Record<string, StoresMegaMenuStore[]> = {}
  for (const cat of sorted) {
    const inCat = services.filter((s) => serviceMatchesCategory(s, cat))
    storesByCategorySlug[cat.slug] = sortServicesForCategorySlug(cat.slug, inCat).map((s) => ({
      slug: s.slug,
      name: s.name,
      imageSrc: megaMenuStoreImageSrc(s)
    }))
  }
  return { categories: marqueeCategories, storesByCategorySlug }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return structuredClone(heroSlides)
}

export async function getFeaturedStores(): Promise<FeaturedStoreWithStore[]> {
  return structuredClone(featuredStores)
}

export async function getTopMonthlyOffers(): Promise<MonthlyTopOffer[]> {
  return structuredClone(monthlyTopOffers)
}

export async function getHotCashbackOffers(): Promise<HotCashbackOffer[]> {
  return structuredClone(HOT_CASHBACK_OFFERS)
}

export async function getHomeClipCoupons(): Promise<HomeClipCoupon[]> {
  return structuredClone(HOME_CLIP_COUPONS)
}

export async function getFeaturedOffers(): Promise<FeaturedOfferWithOffer[]> {
  return structuredClone(featuredOffers)
}

export async function getServices(query?: { category?: string; q?: string }): Promise<Service[]> {
  let list = [...services]
  if (query?.category) {
    const cat = categories.find((c) => c.slug === query.category)
    list = cat ? list.filter((s) => serviceMatchesCategory(s, cat)) : []
    list = sortServicesForCategorySlug(query.category, list)
  }
  if (query?.q?.trim()) {
    const ql = query.q.trim().toLowerCase()
    list = list.filter((s) => {
      const inName = s.name.toLowerCase().includes(ql)
      const inDesc = (s.description?.toLowerCase() ?? '').includes(ql)
      return [inName, inDesc].some((x) => x)
    })
  }
  return list
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const s = services.find((x) => x.slug === slug)
  if (!s) throw new Error(`Store not found: ${slug}`)
  return structuredClone(s)
}

export async function getOffers(
  query: Partial<z.infer<typeof OffersListQuerySchema>> = {}
): Promise<Offer[]> {
  const { status = 'active', service, category, q } = OffersListQuerySchema.partial().parse(query)
  let list = [...offers]
  list = list.filter((o) => o.status === status)
  if (service) {
    const svc = services.find((s) => s.slug === service)
    list = svc ? list.filter((o) => o.serviceId === svc.id) : []
  }
  if (category) {
    const cat = categories.find((c) => c.slug === category)
    list = cat
      ? list.filter((o) => {
          const svc = services.find((s) => s.id === o.serviceId)
          return svc ? serviceMatchesCategory(svc, cat) : false
        })
      : []
  }
  if (q?.trim()) {
    const ql = q.trim().toLowerCase()
    list = list.filter((o) => {
      const inTitle = o.title.toLowerCase().includes(ql)
      const inPreview = o.previewText.toLowerCase().includes(ql)
      return [inTitle, inPreview].some((x) => x)
    })
  }
  return list
}

export async function getOfferById(offerId: string): Promise<Offer> {
  const o = offers.find((x) => x.id === offerId)
  if (!o) throw new Error(`Offer not found: ${offerId}`)
  return structuredClone(o)
}
