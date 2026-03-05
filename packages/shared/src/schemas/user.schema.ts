import { z } from 'zod'
import { UuidSchema } from './common.schema'

export const UserSchema = z.object({
  id: UuidSchema,
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type User = z.infer<typeof UserSchema>
