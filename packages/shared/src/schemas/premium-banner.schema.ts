import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const PremiumBannerSchema = z.object({
  id: UuidSchema,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  priceText: z.string().min(1).max(120),
  priceNote: z.string().max(200).optional().nullable(),
  ctaText: z.string().min(1).max(120),
  ctaHref: z.string().max(500).optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const PremiumBannerCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  priceText: z.string().min(1).max(120),
  priceNote: z.string().max(200).optional().nullable(),
  ctaText: z.string().min(1).max(120),
  ctaHref: z.string().max(500).optional().nullable()
})

export const PremiumBannerUpdateSchema = PremiumBannerCreateSchema.partial()

export type PremiumBanner = z.infer<typeof PremiumBannerSchema>
export type PremiumBannerCreateInput = z.infer<typeof PremiumBannerCreateSchema>
export type PremiumBannerUpdateInput = z.infer<typeof PremiumBannerUpdateSchema>
