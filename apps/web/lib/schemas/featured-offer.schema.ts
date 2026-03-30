import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const FeaturedOfferSchema = z.object({
  id: UuidSchema,
  offerId: UuidSchema,
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const FeaturedOfferCreateSchema = z.object({
  offerId: UuidSchema,
  sortOrder: z.number().int().default(0)
})

export const FeaturedOfferUpdateSchema = FeaturedOfferCreateSchema.partial()

const ServiceWithCategorySchema = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    categoryId: z.string().uuid(),
    website: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    logoSvg: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    category: z
      .object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
      })
      .optional()
  })
)

const OfferWithServiceSchema = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    serviceId: z.string().uuid(),
    title: z.string(),
    previewText: z.string(),
    couponCode: z.string().nullable().optional(),
    bonusAmount: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    referralUrl: z.string().url(),
    terms: z.string().nullable().optional(),
    status: z.enum(['draft', 'active', 'expired']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    service: ServiceWithCategorySchema.optional()
  })
)

export const FeaturedOfferWithOfferSchema = FeaturedOfferSchema.extend({
  offer: OfferWithServiceSchema.optional()
})

export type FeaturedOffer = z.infer<typeof FeaturedOfferSchema>
export type FeaturedOfferWithOffer = z.infer<typeof FeaturedOfferWithOfferSchema>
export type FeaturedOfferCreateInput = z.infer<typeof FeaturedOfferCreateSchema>
export type FeaturedOfferUpdateInput = z.infer<typeof FeaturedOfferUpdateSchema>
