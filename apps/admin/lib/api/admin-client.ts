import {
  CategoryCreateSchema,
  CategorySchema,
  CategoryUpdateSchema,
  CountryCreateSchema,
  CountrySchema,
  CountryUpdateSchema,
  listEnvelopeSchema,
  OfferCreateSchema,
  OffersListQuerySchema,
  OfferSchema,
  OfferUpdateSchema,
  ReferralsListQuerySchema,
  ReferralSchema,
  ReferralUpdateSchema,
  ServiceCreateSchema,
  ServiceSchema,
  ServiceUpdateSchema,
  type Category,
  type CategoryCreateInput,
  type CategoryUpdateInput,
  type Country,
  type CountryCreateInput,
  type CountryUpdateInput,
  type Offer,
  type OfferCreateInput,
  type OffersListQuery,
  type OfferUpdateInput,
  type Referral,
  type ReferralUpdateInput,
  type Service,
  type ServiceCreateInput,
  type ServiceUpdateInput
} from '@bonusbridge/shared'
import { z } from 'zod'
import { env } from '@/lib/env'

function unwrapList<T>(parsed: T[] | { items: T[] }): T[] {
  return Array.isArray(parsed) ? parsed : parsed.items
}

export function createAdminApiClient(accessToken?: string) {
  async function request<T>(
    path: string,
    options: RequestInit,
    schema: z.ZodSchema<T>,
    query?: Record<string, string | number | undefined>
  ) {
    const url = new URL(path, env.apiBaseUrl)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers ?? {})
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Admin API failed with ${response.status}`)
    }

    if (response.status === 204) {
      return schema.parse(null)
    }

    return schema.parse(await response.json())
  }

  return {
    listCountries: async (): Promise<Country[]> =>
      unwrapList(await request('/countries', { method: 'GET' }, listEnvelopeSchema(CountrySchema))),
    createCountry: (payload: CountryCreateInput): Promise<Country> =>
      request('/countries', { method: 'POST', body: JSON.stringify(CountryCreateSchema.parse(payload)) }, CountrySchema),
    updateCountry: (id: string, payload: CountryUpdateInput): Promise<Country> =>
      request(`/countries/${id}`, { method: 'PATCH', body: JSON.stringify(CountryUpdateSchema.parse(payload)) }, CountrySchema),
    deleteCountry: (id: string): Promise<{ ok: true }> =>
      request(`/countries/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listCategories: async (): Promise<Category[]> =>
      unwrapList(await request('/categories', { method: 'GET' }, listEnvelopeSchema(CategorySchema))),
    createCategory: (payload: CategoryCreateInput): Promise<Category> =>
      request('/categories', { method: 'POST', body: JSON.stringify(CategoryCreateSchema.parse(payload)) }, CategorySchema),
    updateCategory: (id: string, payload: CategoryUpdateInput): Promise<Category> =>
      request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(CategoryUpdateSchema.parse(payload)) }, CategorySchema),
    deleteCategory: (id: string): Promise<{ ok: true }> =>
      request(`/categories/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listServices: async (): Promise<Service[]> =>
      unwrapList(await request('/services', { method: 'GET' }, listEnvelopeSchema(ServiceSchema))),
    createService: (payload: ServiceCreateInput): Promise<Service> =>
      request('/services', { method: 'POST', body: JSON.stringify(ServiceCreateSchema.parse(payload)) }, ServiceSchema),
    updateService: (id: string, payload: ServiceUpdateInput): Promise<Service> =>
      request(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(ServiceUpdateSchema.parse(payload)) }, ServiceSchema),
    deleteService: (id: string): Promise<{ ok: true }> =>
      request(`/services/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listOffers: async (query: Partial<OffersListQuery> = {}): Promise<Offer[]> => {
      const normalized = OffersListQuerySchema.partial().parse(query)
      return unwrapList(await request('/offers', { method: 'GET' }, listEnvelopeSchema(OfferSchema), normalized))
    },
    createOffer: (payload: OfferCreateInput): Promise<Offer> =>
      request('/offers', { method: 'POST', body: JSON.stringify(OfferCreateSchema.parse(payload)) }, OfferSchema),
    updateOffer: (id: string, payload: OfferUpdateInput): Promise<Offer> =>
      request(`/offers/${id}`, { method: 'PATCH', body: JSON.stringify(OfferUpdateSchema.parse(payload)) }, OfferSchema),
    deleteOffer: (id: string): Promise<{ ok: true }> =>
      request(`/offers/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listReferrals: async (status: 'pending' | 'approved' | 'rejected' = 'pending'): Promise<Referral[]> => {
      const query = ReferralsListQuerySchema.partial().parse({ status })
      return unwrapList(await request('/referrals', { method: 'GET' }, listEnvelopeSchema(ReferralSchema), query))
    },
    moderateReferral: (id: string, payload: ReferralUpdateInput): Promise<Referral> =>
      request(`/referrals/${id}`, { method: 'PATCH', body: JSON.stringify(ReferralUpdateSchema.parse(payload)) }, ReferralSchema)
  }
}
