import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const FeaturedStoreSchema = z.object({
  id: UuidSchema,
  storeId: UuidSchema,
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const FeaturedStoreCreateSchema = z.object({
  storeId: UuidSchema,
  sortOrder: z.number().int().default(0)
})

export const FeaturedStoreUpdateSchema = FeaturedStoreCreateSchema.partial()

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

export const FeaturedStoreWithStoreSchema = FeaturedStoreSchema.extend({
  store: ServiceWithCategorySchema.optional()
})

export type FeaturedStore = z.infer<typeof FeaturedStoreSchema>
export type FeaturedStoreWithStore = z.infer<typeof FeaturedStoreWithStoreSchema>
export type FeaturedStoreCreateInput = z.infer<typeof FeaturedStoreCreateSchema>
export type FeaturedStoreUpdateInput = z.infer<typeof FeaturedStoreUpdateSchema>
