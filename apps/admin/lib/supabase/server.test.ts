import { afterEach, describe, expect, it, vi } from 'vitest'

const createServerClient = vi.fn(() => ({ kind: 'server-client' }))
const cookieStore = {
  get: vi.fn(() => ({ value: 'cookie-value' })),
  set: vi.fn()
}
const cookies = vi.fn(async () => cookieStore)

vi.mock('@supabase/ssr', () => ({
  createServerClient
}))

vi.mock('next/headers', () => ({
  cookies
}))

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  vi.clearAllMocks()
  vi.resetModules()
})

describe('createSupabaseServerClient', () => {
  it('throws when env is missing', async () => {
    const mod = await import('./server')
    await expect(mod.createSupabaseServerClient()).rejects.toThrow('Supabase environment variables are missing')
  })

  it('creates server client when env exists', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    vi.resetModules()
    const mod = await import('./server')

    await expect(mod.createSupabaseServerClient()).resolves.toEqual({ kind: 'server-client' })
    expect(createServerClient).toHaveBeenCalledOnce()
    expect(cookies).toHaveBeenCalledOnce()

    const options = createServerClient.mock.calls[0]?.[2]
    expect(options?.cookies.get('sb-access-token')).toBe('cookie-value')
    options?.cookies.set('token', 'abc', {})
    options?.cookies.remove('token', {})
    expect(cookieStore.set).toHaveBeenCalledTimes(2)
  })
})
