import { z } from 'zod'
import { ReferralStatusSchema, UrlSchema, UuidSchema } from './common.schema'

export const ReferralSchema = z.object({
  id: UuidSchema,
  offerId: UuidSchema,
  userId: UuidSchema.optional().nullable(),
  referralUrl: UrlSchema.optional().nullable(),
  referralCode: z.string().max(120).optional().nullable(),
  email: z.string().email().optional().nullable(),
  status: ReferralStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const ReferralCreateSchema = z.object({
  offerId: UuidSchema,
  referralUrl: UrlSchema.optional(),
  referralCode: z.string().max(120).optional(),
  email: z.string().email().optional()
})

export const ReferralUpdateSchema = z.object({
  status: ReferralStatusSchema.exclude(['pending'])
})

export const ReferralsListQuerySchema = z.object({
  status: ReferralStatusSchema.default('pending'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})

export type Referral = z.infer<typeof ReferralSchema>
export type ReferralCreateInput = z.infer<typeof ReferralCreateSchema>
export type ReferralUpdateInput = z.infer<typeof ReferralUpdateSchema>
export type ReferralsListQuery = z.infer<typeof ReferralsListQuerySchema>
