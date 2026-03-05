import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_JWT_SECRET: z.string().min(1),
  SUPABASE_JWT_ISSUER: z.string().url().optional(),
  SUPABASE_JWT_AUDIENCE: z.string().min(1).optional(),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3002')
    .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean)),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional()
})

export type Env = z.infer<typeof EnvSchema>

export function parseEnv(env: NodeJS.ProcessEnv): Env {
  return EnvSchema.parse(env)
}
