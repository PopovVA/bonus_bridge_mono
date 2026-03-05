import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('parseEnv', () => {
  it('parses required env', () => {
    const parsed = parseEnv({
      PORT: '3001',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_JWT_SECRET: 'secret'
    })

    expect(parsed.PORT).toBe(3001)
  })
})
