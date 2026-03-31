import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const MonthlyTopOfferSchema = z.object({
  id: UuidSchema,
  brandName: z.string().min(1).max(120),
  slug: z.string().min(1).max(80),
  description: z.string().min(1).max(600),
  ctaText: z.string().min(1).max(80),
  href: z.string().url(),
  logoSrc: z.string().min(1).max(500),
  /** Hero image on the right; omit to show skeleton until you add an asset. */
  imageSrc: z.string().min(1).max(500).optional(),
  /** Short promo label shown in the top-right corner of the card. */
  badgeText: z.string().min(1).max(64).optional()
})

export type MonthlyTopOffer = z.infer<typeof MonthlyTopOfferSchema>
