import {
  CategorySchema,
  FeaturedOfferWithOfferSchema,
  FeaturedStoreWithStoreSchema,
  HeroImageSchema,
  listEnvelopeSchema,
  OffersListQuerySchema,
  OfferSchema,
  PremiumBannerSchema,
  ServiceSchema,
  type Category,
  type FeaturedOfferWithOffer,
  type FeaturedStoreWithStore,
  type HeroImage,
  type Offer,
  type PremiumBanner,
  type Service
} from '@bonusbridge/shared'
import { z } from 'zod'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'

function unwrapList<T>(parsed: T[] | { items: T[] }): T[] {
  return Array.isArray(parsed) ? parsed : parsed.items
}

async function requestJson<T>(path: string, schema: z.ZodSchema<T>, query?: Record<string, string | number | undefined>) {
  const url = new URL(path, baseUrl)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' }
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const json = await response.json()
  return schema.parse(json)
}

export async function getCategories(): Promise<Category[]> {
  const parsed = await requestJson('/categories', listEnvelopeSchema(CategorySchema))
  return unwrapList(parsed)
}

export async function getHeroImages(): Promise<HeroImage[]> {
  const parsed = await requestJson('/hero-images', listEnvelopeSchema(HeroImageSchema))
  return unwrapList(parsed)
}

export async function getPremiumBanner(): Promise<PremiumBanner | null> {
  const parsed = await requestJson('/premium-banner', PremiumBannerSchema.nullable())
  return parsed
}

export async function getFeaturedStores(): Promise<FeaturedStoreWithStore[]> {
  const parsed = await requestJson('/featured-stores', listEnvelopeSchema(FeaturedStoreWithStoreSchema))
  return unwrapList(parsed)
}

export async function getFeaturedOffers(): Promise<FeaturedOfferWithOffer[]> {
  const parsed = await requestJson('/featured-offers', listEnvelopeSchema(FeaturedOfferWithOfferSchema))
  return unwrapList(parsed)
}

export async function getServices(query?: { category?: string; q?: string }): Promise<Service[]> {
  const parsed = await requestJson('/services', listEnvelopeSchema(ServiceSchema), query)
  return unwrapList(parsed)
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  return requestJson(`/services/${slug}`, ServiceSchema)
}

export async function getOffers(query: Partial<z.infer<typeof OffersListQuerySchema>> = {}): Promise<Offer[]> {
  const normalized = OffersListQuerySchema.partial().parse(query)
  const parsed = await requestJson('/offers', listEnvelopeSchema(OfferSchema), normalized)
  return unwrapList(parsed)
}

export async function getOfferById(offerId: string): Promise<Offer> {
  return requestJson(`/offers/${offerId}`, OfferSchema)
}
