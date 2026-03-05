import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  vi.resetModules()
})

describe('admin env helpers', () => {
  it('returns false without supabase env', async () => {
    const mod = await import('./env')
    expect(mod.hasSupabaseEnv()).toBe(false)
  })

  it('returns true with supabase env', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    vi.resetModules()
    const mod = await import('./env')
    expect(mod.hasSupabaseEnv()).toBe(true)
    expect(mod.env.apiBaseUrl).toBe('http://localhost:3001')
  })
})
