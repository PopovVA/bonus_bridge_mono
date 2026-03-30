import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const HeroImageSchema = z.object({
  id: UuidSchema,
  imageUrl: z.string().url(),
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const HeroImageCreateSchema = z.object({
  imageUrl: z.string().url(),
  sortOrder: z.number().int().default(0)
})

export const HeroImageUpdateSchema = HeroImageCreateSchema.partial()

export type HeroImage = z.infer<typeof HeroImageSchema>
export type HeroImageCreateInput = z.infer<typeof HeroImageCreateSchema>
export type HeroImageUpdateInput = z.infer<typeof HeroImageUpdateSchema>
