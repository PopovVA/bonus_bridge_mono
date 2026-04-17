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
      'Uber is a rideshare and mobility app that matches you with drivers for trips in cities worldwide. New riders often qualify for ride credit or discounts when they join through a referral. Savings, caps, and eligibility always follow Uber\'s current offer and terms in your area.',
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
      'Lyft offers on-demand rides and bike or scooter rentals where available. Referral programs can credit new riders after qualifying trips. Check Lyft for the latest bonus rules, markets, and expiration details.',
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
      'Lime operates shared electric scooters and bikes in participating cities. Promotions and referral perks vary by location and change over time — open an active Lime offer on BonusBridge to see the current sign-up or ride credit details.',
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
      'Bird runs shared electric scooters in participating cities. New-rider and referral perks change by market — open an active Bird offer on BonusBridge to see the current code or link and partner terms.',
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
      'Lemonade sells renters, homeowners, pet, and car insurance through a digital-first experience in select states. Friends-and-family referrals may include gift cards or account credit when both sides qualify under Lemonade\'s program rules.',
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
    description:
      'Poshmark is a social marketplace for secondhand clothing, accessories, and home goods. New members sometimes receive shopping credit through invite links; amounts and eligibility follow Poshmark\'s current referral terms.',
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
      'Rakuten is a cash-back portal: start at Rakuten before you shop at partner retailers and earn a percentage back on qualifying purchases. Welcome bonuses for new members are offered on a schedule defined by Rakuten.',
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
      'TopCashback tracks purchases at thousands of stores and pays cash back on eligible orders. Sign-up and referral bonuses change over time; always confirm the latest payout rules on TopCashback before you shop.',
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
      'PayPal Honey (Honey) helps you find coupons and price history while you shop online. Invite rewards and Gold points programs are defined by Honey / PayPal and may require qualifying activity.',
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
      'Chime is a financial technology company, not a bank; banking services are provided by partner banks. Members can earn referral bonuses when friends open accounts and meet direct-deposit or other requirements Chime sets.',
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
      'Robinhood offers commission-free trading of stocks, ETFs, options, and crypto in the U.S. New-user promos often include free fractional stock after you fund your account; limits and IRS reporting follow Robinhood\'s disclosures.',
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
      'Public is a brokerage where you can buy stocks and ETFs, often with a social feed and educational tools. Welcome bonuses vary by campaign; read Public\'s offer terms for funding minimums and asset delivery timing.',
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
      'Klarna lets you split purchases into installments or pay later at many online and in-store merchants. Availability, interest, and fees depend on Klarna\'s credit decision and the merchant — check each offer before you checkout.',
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
      'Uber Eats delivers meals and groceries from local restaurants and merchants. First-order and promo-code savings are subject to minimums, participating stores, and Uber Eats\' terms in your delivery zone.',
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
      '7NOW is 7-Eleven\'s delivery and pickup service for snacks, drinks, and everyday essentials where available. Promotional delivery fees and codes are set by 7-Eleven / franchise partners and change frequently.',
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
      'Airbnb lists short-term stays, long-term rentals, and experiences hosted by individuals worldwide. Guest and host referral credits are governed by Airbnb\'s referral program rules and may require qualifying bookings.',
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
    title: 'See up to $125 new-account bonus (Chime)',
    previewText: 'New account and qualifying direct deposit may be required — amounts and eligibility are set by Chime.',
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
    id: '33333333-3333-4333-8333-333333333303',
    serviceId: '22222222-2222-4222-8222-222222222201',
    title: '50% off your next 2 trips',
    previewText: 'Up to $10 off each of two rides at half price. Caps, timing, and eligibility follow Uber\'s current offer.',
    couponCode: 'zfj232q2gjsx',
    bonusAmount: '$25',
    description: 'Referral credit when you qualify.',
    referralUrl: 'https://referrals.uber.com/refer?id=zfj232q2gjsx',
    terms: 'See Uber for eligibility and terms.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    serviceId: '22222222-2222-4222-8222-222222222202',
    title: '50% off your next ride',
    previewText: 'Up to $10 off one ride for new riders. Market rules and expiry follow Lyft’s current offer.',
    couponCode: 'VADIM53422',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
    terms: 'Lyft terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333305',
    serviceId: '22222222-2222-4222-8222-222222222203',
    title: '$5 sign-up credit',
    previewText: 'New riders get account credit after sign-up. Amount, markets, and expiry follow Lime’s current offer.',
    couponCode: 'REGUD7BFJWT',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://lime.bike/referral_signin/REGUD7BFJWT',
    terms: 'Subject to Lime promotions.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333306',
    serviceId: '22222222-2222-4222-8222-222222222204',
    title: 'Up to $5 ride credit',
    previewText: 'New riders can get up to $5. Enter the code in the app after sign-up. Terms follow Bird.',
    couponCode: 'X86GGD',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://links.bird.co/rKbyq2',
    terms: 'Bird terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333307',
    serviceId: '22222222-2222-4222-8222-222222222205',
    title: 'Lemonade — renters and home insurance',
    previewText: 'Digital insurance with referral rewards when you qualify.',
    couponCode: null,
    bonusAmount: '$10 gift card',
    description: null,
    referralUrl: 'https://lemonade.com/r/vadimpopov1',
    terms: 'See Lemonade for offer details.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333308',
    serviceId: '22222222-2222-4222-8222-222222222206',
    title: '$10 credit when you join',
    previewText: '$10 when you sign up with this code. Further rules and expiry follow Poshmark.',
    couponCode: 'VADIMPOPOV',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://posh.mk/QW6tN2UJW1b',
    terms: 'Poshmark terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333309',
    serviceId: '22222222-2222-4222-8222-222222222207',
    title: 'Rakuten — cash back + welcome bonus',
    previewText: 'Shop through Rakuten for cash back; new members may get a sign-up bonus.',
    couponCode: null,
    bonusAmount: '$50 bonus',
    description: null,
    referralUrl: 'https://www.rakuten.com/r/MVADIM7',
    terms: 'Rakuten program rules apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333310',
    serviceId: '22222222-2222-4222-8222-222222222208',
    title: 'TopCashback — portal bonus',
    previewText: 'Cash back at thousands of stores — join via our referral for current new-member offers.',
    couponCode: null,
    bonusAmount: '$40 cashback',
    description: null,
    referralUrl: 'https://www.topcashback.com/ref/member344836925437',
    terms: 'TopCashback terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333311',
    serviceId: '22222222-2222-4222-8222-222222222209',
    title: 'PayPal Honey — coupons and rewards',
    previewText: 'Automatic savings at checkout — open Honey with our invite.',
    couponCode: null,
    bonusAmount: '$10 cashback',
    description: null,
    referralUrl: 'https://www.joinhoney.com/ref/nwpz6sw',
    terms: 'Honey / PayPal terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333312',
    serviceId: '22222222-2222-4222-8222-222222222211',
    title: 'Get $5 to $200 in stock',
    previewText: 'Gift stock after you sign up and meet funding rules. Many rewards are $5 to $10. Limits and terms on Robinhood.',
    couponCode: 'vadimp-4f32ef3',
    bonusAmount: '$5+ stock',
    description: null,
    referralUrl: 'https://join.robinhood.com/vadimp-4f32ef3',
    terms: 'Robinhood offer terms.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333313',
    serviceId: '22222222-2222-4222-8222-222222222212',
    title: 'Public — investing welcome bonus',
    previewText: 'Join Public through our link for a welcome bonus when you qualify.',
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: 'https://share.public.com/Vadim66923',
    terms: 'Public terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333314',
    serviceId: '22222222-2222-4222-8222-222222222214',
    title: '$20 off delivery orders',
    previewText: 'New accounts get delivery savings. Minimum spend and expiry follow Uber Eats.',
    couponCode: 'eats-zywrn58e0v',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
    terms: 'Uber Eats promotions vary by account and region.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333315',
    serviceId: '22222222-2222-4222-8222-222222222215',
    title: '$10 off your next order',
    previewText: '$10 credit on a qualifying order. Minimum spend and expiry follow 7Now’s current offer.',
    couponCode: 'my1w2j',
    bonusAmount: null,
    description: null,
    referralUrl: 'https://smart.link/370flfia27552?cp_0=my1w2j',
    terms: '7NOW terms apply.',
    status: 'active',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '33333333-3333-4333-8333-333333333316',
    serviceId: '22222222-2222-4222-8222-222222222216',
    title: 'Airbnb — stays and experiences',
    previewText: 'Book homes and trips — see Airbnb for current referral or first-booking offers.',
    couponCode: null,
    bonusAmount: null,
    description: null,
    referralUrl: 'https://www.airbnb.com/',
    terms: 'Airbnb terms and regional rules apply.',
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
    eyebrow: 'Referral bonus (informational)',
    headline: 'See up to $125 new-account bonus (Chime)',
    promoHighlight:
      "Learn how to qualify — new accounts and qualifying direct deposit may be required. Tap the button to continue to Chime's site.",
    subtext:
      "Bonus terms may vary by campaign and region. Friends may have separate eligibility. BonusBridge is not Chime's website.",
    termsLabel: 'See official terms',
    termsUrl: 'https://www.chime.com/legal/all-policies/',
    referralUrl: 'https://www.chime.com/r/vadimpopov1/',
    ctaText: 'Continue to official site'
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

/** Full category → store → active offer tree for `ClientCatalogProvider` (single fetch at root layout). */
export async function getClientCatalog(): Promise<ClientCatalogPayload> {
  const sorted = categoriesSortedAlphabetically()
  const categoriesOut: ClientCatalogCategoryBrief[] = []
  for (const cat of sorted) {
    const inCat = services.filter((s) => serviceMatchesCategory(s, cat))
    const sortedStores = sortServicesForCategorySlug(cat.slug, inCat)
    const stores: ClientCatalogStoreBrief[] = sortedStores.map((svc) => {
      const svcOffers = offers.filter((o) => o.serviceId === svc.id && o.status === 'active')
      return {
        slug: svc.slug,
        name: svc.name,
        logoSrc: svc.logoSrc == null ? null : svc.logoSrc,
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

/** Home “Top offers this month” row item when `slug` matches (Klarna, Robinhood, Public). */
export async function getMonthlyTopOfferForStoreSlug(storeSlug: string): Promise<MonthlyTopOffer | null> {
  const found = monthlyTopOffers.find((o) => o.slug === storeSlug)
  return found ? structuredClone(found) : null
}

/** Sync snapshot for client modules — same data as `getTopMonthlyOffers()` / store spotlight. */
export function getMonthlyTopOfferSnapshotBySlug(slug: string): MonthlyTopOffer | undefined {
  return monthlyTopOffers.find((o) => o.slug === slug)
}

/** Full curated list (store pages need every slug, including Public which also appears in “Top offers this month”). */
export async function getAllHotCashbackOffers(): Promise<HotCashbackOffer[]> {
  return structuredClone(HOT_CASHBACK_OFFERS)
}

/** Home `/` Hot Cashback row — hides slugs that already have a card in `monthlyTopOffers`. */
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
  let list = [...services]
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
