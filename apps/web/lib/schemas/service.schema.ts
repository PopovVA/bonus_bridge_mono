import { z } from 'zod'
import { SlugSchema, UrlSchema, UuidSchema } from './common.schema'

const SvgSchema = z
  .string()
  .max(65536)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : undefined))
  .refine((v) => !v || v.startsWith('<svg'), { message: 'Must be valid SVG markup' })

/** Public asset path for store marks in mega menu / listings (e.g. `/brands/uber-logo.png`). */
const LogoSrcSchema = z.string().max(240).regex(/^\//)

export const ServiceSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1).max(120),
  slug: SlugSchema,
  categoryId: UuidSchema,
  /** Also list this store under these category slugs (e.g. Lemonade in Auto + Finance). */
  extraCategorySlugs: z.array(SlugSchema).max(24).optional(),
  website: UrlSchema.optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  logoSvg: SvgSchema,
  logoSrc: LogoSrcSchema.optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const ServiceCreateSchema = z.object({
  name: z.string().min(1).max(120),
  slug: SlugSchema,
  categoryId: UuidSchema,
  extraCategorySlugs: z.array(SlugSchema).max(24).optional(),
  website: UrlSchema.optional(),
  description: z.string().max(4000).optional(),
  logoSvg: SvgSchema,
  logoSrc: LogoSrcSchema.optional().nullable()
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
