import {
  CountrySchema,
  listEnvelopeSchema,
  type Country,
  OffersListQuerySchema,
  OfferSchema,
  type Offer,
  ServiceSchema,
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

export async function getCountries(): Promise<Country[]> {
  const parsed = await requestJson('/countries', listEnvelopeSchema(CountrySchema))
  return unwrapList(parsed)
}

export async function getServices(): Promise<Service[]> {
  const parsed = await requestJson('/services', listEnvelopeSchema(ServiceSchema))
  return unwrapList(parsed)
}

export async function getOffers(query: Partial<z.infer<typeof OffersListQuerySchema>> = {}): Promise<Offer[]> {
  const normalized = OffersListQuerySchema.partial().parse(query)
  const parsed = await requestJson('/offers', listEnvelopeSchema(OfferSchema), normalized)
  return unwrapList(parsed)
}

export async function getOfferById(offerId: string): Promise<Offer> {
  return requestJson(`/offers/${offerId}`, OfferSchema)
}
