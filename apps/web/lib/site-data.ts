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
const LOGO =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#1a1a1a"/><text x="20" y="26" text-anchor="middle" fill="#fff" font-size="14" font-family="system-ui">B</text></svg>'

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
    id: '11111111-1111-4111-8111-111111111108',
    name: 'Entertainment',
    slug: 'entertainment',
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
    id: '11111111-1111-4111-8111-111111111110',
    name: 'Sports',
    slug: 'sports',
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

function categoriesSortedAlphabetically(): Category[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'en'))
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
}

export type StoresMegaMenuPayload = {
  categories: StoresMegaMenuCategory[]
  storesByCategorySlug: Record<string, StoresMegaMenuStore[]>
}

const services: Service[] = [
  {
    id: '22222222-2222-4222-8222-222222222201',
    name: 'Acme Cash',
    slug: 'acme-cash',
    categoryId: '11111111-1111-4111-8111-111111111101',
    website: 'https://example.com/acme-cash',
    description: 'Cashback and referral bonuses for everyday spending.',
    logoSvg: LOGO,
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222202',
    name: 'Bonus Shop',
    slug: 'bonus-shop',
    categoryId: '11111111-1111-4111-8111-111111111102',
    website: 'https://example.com/bonus-shop',
    description: 'Deals and promo codes for online shopping.',
    logoSvg: LOGO,
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222203',
    name: 'No Desc Mart',
    slug: 'no-desc-mart',
    categoryId: '11111111-1111-4111-8111-111111111102',
    website: 'https://example.com/no-desc',
    description: null,
    logoSvg: LOGO,
    createdAt: ISO,
    updatedAt: ISO
  }
]

const offers: Offer[] = [
  {
    id: '33333333-3333-4333-8333-333333333301',
    serviceId: '22222222-2222-4222-8222-222222222201',
    title: '$25 referral when you join Acme Cash',
    previewText: 'New members earn a bonus after first qualifying purchase.',
    couponCode: 'WELCOME25',
    bonusAmount: '$25',
    description: 'Refer a friend and both get rewards. Terms apply.',
    referralUrl: 'https://example.com/acme-cash/ref',
    terms: 'Valid for new accounts only. Expires at end of month.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    serviceId: '22222222-2222-4222-8222-222222222202',
    title: '15% off first order at Bonus Shop',
    previewText: 'Stack with free shipping on orders over $50.',
    couponCode: null,
    bonusAmount: '15%',
    description: 'Use at checkout. Some brands excluded.',
    referralUrl: 'https://example.com/bonus-shop/deal',
    terms: 'One use per customer.',
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
    storesByCategorySlug[cat.slug] = services
      .filter((s) => s.categoryId === cat.id)
      .map((s) => ({ slug: s.slug, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
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
    list = cat ? list.filter((s) => s.categoryId === cat.id) : []
  }
  if (query?.q?.trim()) {
    const ql = query.q.trim().toLowerCase()
    list = list.filter(
      (s) => s.name.toLowerCase().includes(ql) || (s.description?.toLowerCase() ?? '').includes(ql)
    )
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
    list = cat ? list.filter((o) => services.find((s) => s.id === o.serviceId)?.categoryId === cat.id) : []
  }
  if (q?.trim()) {
    const ql = q.trim().toLowerCase()
    list = list.filter(
      (o) => o.title.toLowerCase().includes(ql) || o.previewText.toLowerCase().includes(ql)
    )
  }
  return list
}

export async function getOfferById(offerId: string): Promise<Offer> {
  const o = offers.find((x) => x.id === offerId)
  if (!o) throw new Error(`Offer not found: ${offerId}`)
  return structuredClone(o)
}
