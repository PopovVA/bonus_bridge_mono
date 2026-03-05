import { z } from 'zod'
import { OfferSortSchema, OfferStatusSchema, UrlSchema, UuidSchema } from './common.schema'

export const OfferSchema = z.object({
  id: UuidSchema,
  serviceId: UuidSchema,
  countryId: UuidSchema,
  title: z.string().min(2).max(180),
  previewText: z.string().min(1).max(500),
  couponCode: z.string().max(120).optional().nullable(),
  bonusAmount: z.string().max(120).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  referralUrl: UrlSchema,
  terms: z.string().max(4000).optional().nullable(),
  status: OfferStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const OfferCreateSchema = z.object({
  serviceId: UuidSchema,
  countryId: UuidSchema,
  title: z.string().min(2).max(180),
  previewText: z.string().min(1).max(500),
  couponCode: z.string().max(120).optional().nullable(),
  bonusAmount: z.string().max(120).optional(),
  description: z.string().max(4000).optional(),
  referralUrl: UrlSchema,
  terms: z.string().max(4000).optional(),
  status: OfferStatusSchema.default('draft')
})

export const OfferUpdateSchema = OfferCreateSchema.partial()

export const OffersListQuerySchema = z.object({
  country: z.string().length(2).optional(),
  service: z.string().min(2).max(120).optional(),
  category: z.string().min(2).max(120).optional(),
  status: OfferStatusSchema.default('active'),
  q: z.string().min(1).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: OfferSortSchema.default('new')
})

export type Offer = z.infer<typeof OfferSchema>
export type OfferCreateInput = z.infer<typeof OfferCreateSchema>
export type OfferUpdateInput = z.infer<typeof OfferUpdateSchema>
export type OffersListQuery = z.infer<typeof OffersListQuerySchema>
