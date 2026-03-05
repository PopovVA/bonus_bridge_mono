import {
  CategoryCreateSchema,
  CategorySchema,
  CategoryUpdateSchema,
  FeaturedOfferCreateSchema,
  FeaturedOfferSchema,
  FeaturedOfferUpdateSchema,
  FeaturedStoreCreateSchema,
  FeaturedStoreSchema,
  FeaturedStoreUpdateSchema,
  HeroImageCreateSchema,
  HeroImageSchema,
  HeroImageUpdateSchema,
  listEnvelopeSchema,
  OfferCreateSchema,
  OffersListQuerySchema,
  OfferSchema,
  OfferUpdateSchema,
  PremiumBannerCreateSchema,
  PremiumBannerSchema,
  PremiumBannerUpdateSchema,
  ReferralsListQuerySchema,
  ReferralSchema,
  ReferralUpdateSchema,
  ServiceCreateSchema,
  ServiceSchema,
  ServiceUpdateSchema,
  type Category,
  type CategoryCreateInput,
  type CategoryUpdateInput,
  type FeaturedOffer,
  type FeaturedOfferCreateInput,
  type FeaturedOfferUpdateInput,
  type FeaturedStore,
  type FeaturedStoreCreateInput,
  type FeaturedStoreUpdateInput,
  type HeroImage,
  type HeroImageCreateInput,
  type HeroImageUpdateInput,
  type Offer,
  type OfferCreateInput,
  type OffersListQuery,
  type OfferUpdateInput,
  type PremiumBanner,
  type PremiumBannerCreateInput,
  type PremiumBannerUpdateInput,
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
      let detail = ''
      try {
        const body = await response.json()
        if (body?.message) detail = `: ${body.message}`
      } catch {
        // ignore
      }
      throw new Error(`Admin API failed with ${response.status}${detail}`)
    }

    if (response.status === 204) {
      return schema.parse(null)
    }

    return schema.parse(await response.json())
  }

  return {
    listCategories: async (): Promise<Category[]> =>
      unwrapList(await request('/categories', { method: 'GET' }, listEnvelopeSchema(CategorySchema))),
    createCategory: (payload: CategoryCreateInput): Promise<Category> =>
      request('/categories', { method: 'POST', body: JSON.stringify(CategoryCreateSchema.parse(payload)) }, CategorySchema),
    updateCategory: (id: string, payload: CategoryUpdateInput): Promise<Category> =>
      request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(CategoryUpdateSchema.parse(payload)) }, CategorySchema),
    deleteCategory: (id: string): Promise<{ ok: true }> =>
      request(`/categories/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listHeroImages: async (): Promise<HeroImage[]> =>
      unwrapList(await request('/hero-images', { method: 'GET' }, listEnvelopeSchema(HeroImageSchema))),
    createHeroImage: (payload: HeroImageCreateInput): Promise<HeroImage> =>
      request('/hero-images', { method: 'POST', body: JSON.stringify(HeroImageCreateSchema.parse(payload)) }, HeroImageSchema),
    updateHeroImage: (id: string, payload: HeroImageUpdateInput): Promise<HeroImage> =>
      request(`/hero-images/${id}`, { method: 'PATCH', body: JSON.stringify(HeroImageUpdateSchema.parse(payload)) }, HeroImageSchema),
    deleteHeroImage: (id: string): Promise<{ ok: true }> =>
      request(`/hero-images/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listPremiumBanners: async (): Promise<PremiumBanner[]> =>
      unwrapList(await request('/premium-banner/all', { method: 'GET' }, listEnvelopeSchema(PremiumBannerSchema))),
    createPremiumBanner: (payload: PremiumBannerCreateInput): Promise<PremiumBanner> =>
      request('/premium-banner', { method: 'POST', body: JSON.stringify(PremiumBannerCreateSchema.parse(payload)) }, PremiumBannerSchema),
    updatePremiumBanner: (id: string, payload: PremiumBannerUpdateInput): Promise<PremiumBanner> =>
      request(`/premium-banner/${id}`, { method: 'PATCH', body: JSON.stringify(PremiumBannerUpdateSchema.parse(payload)) }, PremiumBannerSchema),
    deletePremiumBanner: (id: string): Promise<{ ok: true }> =>
      request(`/premium-banner/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listFeaturedStores: async (): Promise<FeaturedStore[]> =>
      unwrapList(await request('/featured-stores/admin', { method: 'GET' }, listEnvelopeSchema(FeaturedStoreSchema))),
    createFeaturedStore: (payload: FeaturedStoreCreateInput): Promise<FeaturedStore> =>
      request('/featured-stores', { method: 'POST', body: JSON.stringify(FeaturedStoreCreateSchema.parse(payload)) }, FeaturedStoreSchema),
    updateFeaturedStore: (id: string, payload: FeaturedStoreUpdateInput): Promise<FeaturedStore> =>
      request(`/featured-stores/${id}`, { method: 'PATCH', body: JSON.stringify(FeaturedStoreUpdateSchema.parse(payload)) }, FeaturedStoreSchema),
    deleteFeaturedStore: (id: string): Promise<{ ok: true }> =>
      request(`/featured-stores/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

    listFeaturedOffers: async (): Promise<FeaturedOffer[]> =>
      unwrapList(await request('/featured-offers/admin', { method: 'GET' }, listEnvelopeSchema(FeaturedOfferSchema))),
    createFeaturedOffer: (payload: FeaturedOfferCreateInput): Promise<FeaturedOffer> =>
      request('/featured-offers', { method: 'POST', body: JSON.stringify(FeaturedOfferCreateSchema.parse(payload)) }, FeaturedOfferSchema),
    updateFeaturedOffer: (id: string, payload: FeaturedOfferUpdateInput): Promise<FeaturedOffer> =>
      request(`/featured-offers/${id}`, { method: 'PATCH', body: JSON.stringify(FeaturedOfferUpdateSchema.parse(payload)) }, FeaturedOfferSchema),
    deleteFeaturedOffer: (id: string): Promise<{ ok: true }> =>
      request(`/featured-offers/${id}`, { method: 'DELETE' }, z.object({ ok: z.literal(true) })),

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
