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
import { isPublicStoreSlug, programClaim, requirePublicReferralUrl } from '@/lib/referral-programs'

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
  auto: ['lyft'],
  electronics: ['rakuten', 'topcashback', 'honey'],
  finance: ['chime'],
  food: [],
  shopping: ['rakuten', 'topcashback', 'honey'],
  /* Empty order → alphabetical sort in `sortServicesForCategorySlug`. */
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

/** Client-only catalog: categories → stores → active offers (hydrated once, reused e.g. on store pages). */
export type ClientCatalogOfferBrief = {
  id: string
  serviceSlug: string
  serviceName: string
  title: string
  previewText: string
  couponCode: string | null
  referralUrl: string
}

export type ClientCatalogStoreBrief = {
  slug: string
  name: string
  logoSrc: string | null
  offers: ClientCatalogOfferBrief[]
}

export type ClientCatalogCategoryBrief = {
  slug: string
  name: string
  stores: ClientCatalogStoreBrief[]
}

export type ClientCatalogPayload = {
  categories: ClientCatalogCategoryBrief[]
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
    description:
      'Uber is a rideshare app. BonusBridge does not publish a personal Uber referral link. Uber’s referral code policy is for personal, non-commercial sharing, not a public coupon listing.',
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
    description:
      'Lyft offers on-demand rides where available. A new rider may receive a market-specific credit after a first ride within 30 days. Lyft does not authorize one fixed dollar amount for every city. Confirm the credit in the Lyft app and in Lyft’s referral terms.',
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
    description:
      'Lime operates shared electric scooters and bikes in participating cities. BonusBridge does not list a Lime referral because US public-posting terms were not verified.',
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
    description:
      'Bird runs shared electric scooters in participating cities. BonusBridge does not list a Bird referral because US public-posting terms were not found.',
    logoSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 26" aria-hidden="true"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#13294B" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.03em">Bird</text></svg>',
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
    description:
      'Lemonade sells insurance online in select states. BonusBridge does not publish a Lemonade referral. Unlicensed persons cannot describe coverage or recommend a policy.',
    logoSvg: undefined,
    logoSrc: '/hot-cashback/logos/lemonade.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222230',
    name: 'Visible',
    slug: 'visible',
    categoryId: CAT.electronics,
    website: 'https://www.visible.com/',
    description:
      'Visible is a prepaid phone plan that runs on Verizon’s network. BonusBridge does not publish a Visible referral code because the program terms do not allow posting it on a public website.',
    logoSvg: undefined,
    logoSrc: '/brands/visible.svg',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '22222222-2222-4222-8222-222222222231',
    name: 'Hilton Honors Amex Card',
    slug: 'amex-hilton-honors',
    categoryId: CAT.travel,
    website: 'https://www.americanexpress.com/us/credit-cards/card/hilton-honors/',
    description:
      'The Hilton Honors American Express Card is a hotel rewards credit card issued by American Express. BonusBridge does not publish a personal referral link for this card.',
    logoSvg: undefined,
    logoSrc: '/brands/amex-hilton-honors.svg',
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
    description:
      'Poshmark is a marketplace for secondhand clothing and home goods. BonusBridge does not publish a Poshmark referral because US advertising rules were not verified.',
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
    description:
      'Rakuten is a cash-back portal. Start at Rakuten before you shop partner stores. The welcome bonus varies by the active promo and typically requires a qualifying Cash Back purchase within 90 days. Amazon and certain categories are excluded.',
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
    description:
      'TopCashback pays cash back on eligible orders. The referrer bonus is $10 after a new member reaches $10 in eligible Cash Back within 365 days. The invitee bonus depends on the active promo.',
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
    description:
      'PayPal Honey finds coupons while you shop. Referral rewards are PayPal Rewards points, not instant cash. A referrer may receive 500 points after a friend’s eligible purchase confirms, often 60 to 90 days later.',
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
    description:
      'Chime is a financial technology company, not a bank. Banking services come from partner banks. A standard referral needs a qualifying direct deposit of at least $200 within 45 days and card activation. Successful referrals are capped at 10 per calendar year.',
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
    description:
      'Robinhood offers brokerage accounts in the U.S. BonusBridge does not publish a Robinhood referral. The invite offer is for personal use with someone you know, not commercial pages.',
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
    description:
      'Public is a brokerage for stocks, ETFs, and related products, often with educational tools. BonusBridge does not publish a public referral link for Public. Any offer or eligibility is set by Public and is not promoted on this page.',
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
    description:
      'Klarna offers pay-later and installment checkout at participating merchants. Interest, fees, and availability depend on Klarna and the merchant. BonusBridge does not publish a public referral link for Klarna on this page.',
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
    description:
      'Uber Eats delivers from local restaurants. BonusBridge does not publish an Uber Eats promo code. Uber’s referral policy is personal and non-commercial.',
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
    description:
      '7NOW is 7-Eleven’s delivery service where available. BonusBridge removed the previous link because attribution did not reliably carry a referral.',
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
    description:
      'Airbnb lists stays and experiences. BonusBridge does not publish an Airbnb referral. The previous outbound link was the public homepage, not an invite.',
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
    title: 'Chime referral requirements',
    previewText: programClaim('chime'),
    couponCode: null,
    bonusAmount: null,
    description: 'Qualifying direct deposit, card activation, and a 10-referral yearly cap.',
    referralUrl: requirePublicReferralUrl('chime'),
    terms: 'Confirm the live checklist on Chime. Peer-to-peer transfers do not count as direct deposit.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    serviceId: '22222222-2222-4222-8222-222222222202',
    title: 'Lyft market-specific rider credit',
    previewText: programClaim('lyft'),
    couponCode: 'VADIM53422',
    bonusAmount: null,
    description: null,
    referralUrl: requirePublicReferralUrl('lyft'),
    terms: 'See Lyft referral terms. Do not rely on a single nationwide dollar amount.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333309',
    serviceId: '22222222-2222-4222-8222-222222222207',
    title: 'Rakuten welcome bonus varies',
    previewText: programClaim('rakuten'),
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: requirePublicReferralUrl('rakuten'),
    terms: 'Rakuten Refer-A-Friend terms. Amazon.com is excluded except narrow cases such as music.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333310',
    serviceId: '22222222-2222-4222-8222-222222222208',
    title: 'TopCashback refer-a-friend details',
    previewText: programClaim('topcashback'),
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: requirePublicReferralUrl('topcashback'),
    terms: 'TopCashback refer-a-friend terms. Many retailers are excluded from eligible Cash Back.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333311',
    serviceId: '22222222-2222-4222-8222-222222222209',
    title: 'PayPal Honey points, not cash',
    previewText: programClaim('honey'),
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: requirePublicReferralUrl('honey'),
    terms: 'Honey help: points confirm after a friend’s eligible purchase, often in 60 to 90 days.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333399',
    serviceId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    title: 'Detached offer row',
    previewText: 'No matching store id. Omitted from category listings.',
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
    eyebrow: 'Banking referral guide',
    headline: 'Chime referral requirements',
    promoHighlight:
      'Qualifying direct deposit of at least $200 within 45 days, plus card activation. Cap: 10 successful referrals per calendar year.',
    subtext:
      'The referrer bonus is set when a friend enrolls. It is not a guaranteed dollar total. Peer-to-peer transfers do not count. BonusBridge is not Chime.',
    termsLabel: 'Chime referral help',
    termsUrl: 'https://help.chime.com/what-is-chimes-standard-referral-program-eca42e30',
    referralUrl: requirePublicReferralUrl('chime'),
    ctaText: 'Get $100 with Chime'
  }
]

const featuredLyft = services.find((service) => service.slug === 'lyft') as Service
const featuredRakuten = services.find((service) => service.slug === 'rakuten') as Service
const featuredChimeOffer = offers.find((offer) => offer.id === '33333333-3333-4333-8333-333333333301') as Offer
const featuredRakutenOffer = offers.find((offer) => offer.id === '33333333-3333-4333-8333-333333333309') as Offer

const featuredStores: FeaturedStoreWithStore[] = [
  {
    id: '44444444-4444-4444-8444-444444444401',
    storeId: featuredLyft.id,
    sortOrder: 0,
    createdAt: ISO,
    updatedAt: ISO,
    store: serviceWithCategory(featuredLyft, categories)
  },
  {
    id: '44444444-4444-4444-8444-444444444402',
    storeId: featuredRakuten.id,
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO,
    store: serviceWithCategory(featuredRakuten, categories)
  }
]

const featuredOffers: FeaturedOfferWithOffer[] = [
  {
    id: '66666666-6666-4666-8666-666666666601',
    offerId: featuredChimeOffer.id,
    sortOrder: 0,
    createdAt: ISO,
    updatedAt: ISO,
    offer: offerWithService(featuredChimeOffer, services, categories)
  },
  {
    id: '66666666-6666-4666-8666-666666666602',
    offerId: featuredRakutenOffer.id,
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO,
    offer: offerWithService(featuredRakutenOffer, services, categories)
  }
]

const monthlyTopOffers: MonthlyTopOffer[] = MonthlyTopOfferSchema.array().parse([
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
    brandName: 'TopCashback',
    slug: 'topcashback',
    description: programClaim('topcashback'),
    ctaText: 'Join TopCashback',
    href: requirePublicReferralUrl('topcashback'),
    logoSrc: '/hot-cashback/logos/topcashback.png',
    badgeText: 'Terms apply'
  }
])

export async function getCategories(): Promise<Category[]> {
  return structuredClone(categoriesSortedAlphabetically())
}

/** Categories A–Z that hold at least one listed store. Empty ones stay reachable by URL but are not promoted. */
function publishedCategoriesSorted(): Category[] {
  const listed = listedServices()
  return categoriesSortedAlphabetically().filter((cat) => listed.some((s) => serviceMatchesCategory(s, cat)))
}

/** Same as `getCategories()` minus categories with no listed stores (sitemap, menus, marquee). */
export async function getPublishedCategories(): Promise<Category[]> {
  return structuredClone(publishedCategoriesSorted())
}

export async function getHomeCategoryMarquee(): Promise<HomeCategoryChip[]> {
  return publishedCategoriesSorted().map((c) => ({
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

/** Catalog JSON stores null instead of an omitted logo path. */
export function catalogLogoSrc(logoSrc: string | null | undefined): string | null {
  return logoSrc ?? null
}

function listedServices(): Service[] {
  return services.filter((service) => isPublicStoreSlug(service.slug))
}

/** Categories A–Z, plus stores per category slug (for header mega menu). */
export async function getStoresMegaMenu(): Promise<StoresMegaMenuPayload> {
  const sorted = publishedCategoriesSorted()
  const marqueeCategories: StoresMegaMenuCategory[] = sorted.map((c) => ({
    slug: c.slug,
    name: c.name,
    imageSrc: `/categories/${c.slug}.svg`
  }))
  const storesByCategorySlug: Record<string, StoresMegaMenuStore[]> = {}
  for (const cat of sorted) {
    const inCat = listedServices().filter((s) => serviceMatchesCategory(s, cat))
    storesByCategorySlug[cat.slug] = sortServicesForCategorySlug(cat.slug, inCat).map((s) => ({
      slug: s.slug,
      name: s.name,
      imageSrc: megaMenuStoreImageSrc(s)
    }))
  }
  return { categories: marqueeCategories, storesByCategorySlug }
}

/** Full category → store → active offer tree for `ClientCatalogProvider` (single fetch at root layout). */
export async function getClientCatalog(): Promise<ClientCatalogPayload> {
  const sorted = publishedCategoriesSorted()
  const categoriesOut: ClientCatalogCategoryBrief[] = []
  for (const cat of sorted) {
    const inCat = listedServices().filter((s) => serviceMatchesCategory(s, cat))
    const sortedStores = sortServicesForCategorySlug(cat.slug, inCat)
    const stores: ClientCatalogStoreBrief[] = sortedStores.map((svc) => {
      const svcOffers = offers.filter((o) => o.serviceId === svc.id && o.status === 'active')
      return {
        slug: svc.slug,
        name: svc.name,
        logoSrc: catalogLogoSrc(svc.logoSrc),
        offers: svcOffers.map((o) => ({
          id: o.id,
          serviceSlug: svc.slug,
          serviceName: svc.name,
          title: o.title,
          previewText: o.previewText,
          couponCode: o.couponCode == null ? null : o.couponCode,
          referralUrl: o.referralUrl
        }))
      }
    })
    categoriesOut.push({ slug: cat.slug, name: cat.name, stores })
  }
  return { categories: categoriesOut }
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

/** Home offer-details row item when `slug` matches a card still published there. */
export async function getMonthlyTopOfferForStoreSlug(storeSlug: string): Promise<MonthlyTopOffer | null> {
  const found = monthlyTopOffers.find((o) => o.slug === storeSlug)
  return found ? structuredClone(found) : null
}

/** Sync snapshot for client modules — same data as `getTopMonthlyOffers()` / store spotlight. */
export function getMonthlyTopOfferSnapshotBySlug(slug: string): MonthlyTopOffer | undefined {
  return monthlyTopOffers.find((o) => o.slug === slug)
}

/** Full curated partner-offer list used by home and Explore More. */
export async function getAllHotCashbackOffers(): Promise<HotCashbackOffer[]> {
  return structuredClone(HOT_CASHBACK_OFFERS)
}

/** Home `/` partner-offer row — hides slugs that already have a card in `monthlyTopOffers`. */
export async function getHotCashbackOffers(): Promise<HotCashbackOffer[]> {
  const monthlySlugs = new Set(monthlyTopOffers.map((o) => o.slug))
  return structuredClone(HOT_CASHBACK_OFFERS.filter((h) => !monthlySlugs.has(h.slug)))
}

export async function getHomeClipCoupons(): Promise<HomeClipCoupon[]> {
  return structuredClone(HOME_CLIP_COUPONS)
}

export async function getFeaturedOffers(): Promise<FeaturedOfferWithOffer[]> {
  return structuredClone(featuredOffers)
}

/** Match store name or description against a lowercased query (shared with tests for branch coverage). */
export function serviceMatchesSearchQuery(
  s: Pick<Service, 'name' | 'description'>,
  ql: string
): boolean {
  const inName = s.name.toLowerCase().includes(ql)
  const desc = s.description == null ? '' : s.description.toLowerCase()
  const inDesc = desc.includes(ql)
  return inName || inDesc
}

export async function getServices(query?: { category?: string; q?: string }): Promise<Service[]> {
  let list = listedServices()
  if (query?.category) {
    const cat = categories.find((c) => c.slug === query.category)
    list = cat ? list.filter((s) => serviceMatchesCategory(s, cat)) : []
    list = sortServicesForCategorySlug(query.category, list)
  }
  if (query?.q?.trim()) {
    const ql = query.q.trim().toLowerCase()
    list = list.filter((s) => serviceMatchesSearchQuery(s, ql))
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

/** For `/coupons/[id]` → `/stores/[slug]` redirects; `null` if the id is unknown. */
export async function getStoreSlugForOfferId(offerId: string): Promise<string | null> {
  const o = offers.find((x) => x.id === offerId)
  if (!o) return null
  const svc = services.find((s) => s.id === o.serviceId)
  if (!svc) return null
  return svc.slug
}
