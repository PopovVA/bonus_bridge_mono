/**
 * Fixed in-repo content for the public site. Edit this file to change copy, stores, and coupons.
 */
import {
  OffersListQuerySchema,
  type Category,
  type FeaturedOfferWithOffer,
  type FeaturedStoreWithStore,
  type HeroSlide,
  type Offer,
  type PremiumBanner,
  type Service
} from '@/lib/schemas'
import type { z } from 'zod'
import { offerWithService, serviceWithCategory } from '@/lib/site-data-relations'

const ISO = '2026-03-01T12:00:00.000Z'
const LOGO =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#1a1a1a"/><text x="20" y="26" text-anchor="middle" fill="#fff" font-size="14" font-family="system-ui">B</text></svg>'

const categories: Category[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Finance',
    slug: 'finance',
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    name: 'Shopping',
    slug: 'shopping',
    createdAt: ISO,
    updatedAt: ISO
  }
]

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
    subtext:
      "Amounts and eligibility follow Chime's current promo. Friends may qualify for separate offers. SpotMe® extras may apply.",
    termsLabel: 'View terms',
    termsUrl: 'https://www.chime.com/legal/all-policies/',
    referralUrl: 'https://www.chime.com/r/vadimpopov1/',
    ctaText: 'Get your $125'
  },
  {
    kind: 'image',
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    imageUrl: 'https://picsum.photos/id/29/1200/600',
    sortOrder: 1,
    createdAt: ISO,
    updatedAt: ISO
  },
  {
    kind: 'image',
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    imageUrl: 'https://picsum.photos/id/48/1200/600',
    sortOrder: 2,
    createdAt: ISO,
    updatedAt: ISO
  }
]

const premiumBanner: PremiumBanner = {
  id: '55555555-5555-4555-8555-555555555501',
  title: 'Join BonusBridge Premium',
  description: 'Unlock curated deals, early access to promos, and referral tools in one place.',
  priceText: '$4.99/mo',
  priceNote: 'Cancel anytime',
  ctaText: 'Learn more',
  ctaHref: 'https://example.com/premium',
  createdAt: ISO,
  updatedAt: ISO
}

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

export async function getCategories(): Promise<Category[]> {
  return structuredClone(categories)
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return structuredClone(heroSlides)
}

export async function getPremiumBanner(): Promise<PremiumBanner | null> {
  return structuredClone(premiumBanner)
}

export async function getFeaturedStores(): Promise<FeaturedStoreWithStore[]> {
  return structuredClone(featuredStores)
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
