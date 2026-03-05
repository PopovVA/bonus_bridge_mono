import { z } from 'zod'
import { CountryCodeSchema, UuidSchema } from './common.schema'

export const CountrySchema = z.object({
  id: UuidSchema,
  name: z.string().min(1).max(120),
  code: CountryCodeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const CountryCreateSchema = z.object({
  name: z.string().min(1).max(120),
  code: CountryCodeSchema
})

export const CountryUpdateSchema = CountryCreateSchema.partial()

export type Country = z.infer<typeof CountrySchema>
export type CountryCreateInput = z.infer<typeof CountryCreateSchema>
export type CountryUpdateInput = z.infer<typeof CountryUpdateSchema>
