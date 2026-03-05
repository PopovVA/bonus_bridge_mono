import { z } from 'zod'

export const UuidSchema = z.string().uuid()
export const SlugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export const CountryCodeSchema = z.string().length(2).transform((v) => v.toUpperCase())
export const UrlSchema = z.string().url()

export const OfferStatusSchema = z.enum(['draft', 'active', 'expired'])
export const ReferralStatusSchema = z.enum(['pending', 'approved', 'rejected'])
export const OfferSortSchema = z.enum(['new', 'bonus'])

export const listEnvelopeSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.union([
    z.array(itemSchema),
    z.object({
      items: z.array(itemSchema),
      total: z.number().optional(),
      limit: z.number().optional(),
      offset: z.number().optional()
    })
  ])
