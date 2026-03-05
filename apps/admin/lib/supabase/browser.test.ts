import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ kind: 'browser-client' }))
}))

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  vi.resetModules()
})

describe('createSupabaseBrowserClient', () => {
  it('throws when env is missing', async () => {
    const mod = await import('./browser')
    expect(() => mod.createSupabaseBrowserClient()).toThrow('Supabase environment variables are missing')
  })

  it('returns browser client when env exists', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    vi.resetModules()
    const mod = await import('./browser')

    expect(mod.createSupabaseBrowserClient()).toEqual({ kind: 'browser-client' })
  })
})
