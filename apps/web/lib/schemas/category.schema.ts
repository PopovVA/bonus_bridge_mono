import { z } from 'zod'
import { SlugSchema, UuidSchema } from './common.schema'

export const CategorySchema = z.object({
  id: UuidSchema,
  name: z.string().min(1).max(120),
  slug: SlugSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const CategoryCreateSchema = z.object({
  name: z.string().min(1).max(120),
  slug: SlugSchema
})

export const CategoryUpdateSchema = CategoryCreateSchema.partial()

export type Category = z.infer<typeof CategorySchema>
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>
