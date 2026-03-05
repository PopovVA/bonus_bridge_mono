import { z } from 'zod'
import { SlugSchema, UrlSchema, UuidSchema } from './common.schema'

const SvgSchema = z
  .string()
  .max(65536)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : undefined))
  .refine((v) => !v || v.startsWith('<svg'), { message: 'Must be valid SVG markup' })

export const ServiceSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1).max(120),
  slug: SlugSchema,
  categoryId: UuidSchema,
  website: UrlSchema.optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  logoSvg: SvgSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const ServiceCreateSchema = z.object({
  name: z.string().min(1).max(120),
  slug: SlugSchema,
  categoryId: UuidSchema,
  website: UrlSchema.optional(),
  description: z.string().max(4000).optional(),
  logoSvg: SvgSchema
})

export const ServiceUpdateSchema = ServiceCreateSchema.partial()

export const ServicesListQuerySchema = z.object({
  category: SlugSchema.optional(),
  q: z.string().min(1).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})

export type Service = z.infer<typeof ServiceSchema>
export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>
export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>
export type ServicesListQuery = z.infer<typeof ServicesListQuerySchema>
