import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetSession = vi.fn()
const mockRefreshSession = vi.fn()
const mockHasSupabaseEnv = vi.fn(() => true)
const mockCreateSupabaseServerClient = vi.fn(() => ({
  auth: { getSession: mockGetSession, refreshSession: mockRefreshSession }
}))

vi.mock('@/lib/env', () => ({
  hasSupabaseEnv: () => mockHasSupabaseEnv()
}))

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient
}))

afterEach(() => {
  mockHasSupabaseEnv.mockReturnValue(true)
  vi.clearAllMocks()
})

describe('getAccessToken', () => {
  it('returns undefined when hasSupabaseEnv is false', async () => {
    mockHasSupabaseEnv.mockReturnValue(false)

    const { getAccessToken } = await import('./auth')
    expect(await getAccessToken()).toBeUndefined()
    expect(mockCreateSupabaseServerClient).not.toHaveBeenCalled()
  })

  it('returns undefined when no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    const { getAccessToken } = await import('./auth')
    expect(await getAccessToken()).toBeUndefined()
  })

  it('returns access_token from session', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'token-123' } }
    })

    const { getAccessToken } = await import('./auth')
    expect(await getAccessToken()).toBe('token-123')
  })
})

describe('getAccessTokenForMutation', () => {
  it('returns undefined when hasSupabaseEnv is false', async () => {
    mockHasSupabaseEnv.mockReturnValue(false)

    const { getAccessTokenForMutation } = await import('./auth')
    expect(await getAccessTokenForMutation()).toBeUndefined()
    expect(mockCreateSupabaseServerClient).not.toHaveBeenCalled()
  })

  it('returns undefined when no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    const { getAccessTokenForMutation } = await import('./auth')
    expect(await getAccessTokenForMutation()).toBeUndefined()
  })

  it('returns refreshed token when refreshSession succeeds', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'old-token' } }
    })
    mockRefreshSession.mockResolvedValue({
      data: { session: { access_token: 'new-token' } }
    })

    const { getAccessTokenForMutation } = await import('./auth')
    expect(await getAccessTokenForMutation()).toBe('new-token')
  })

  it('falls back to original session when refresh returns null', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'original-token' } }
    })
    mockRefreshSession.mockResolvedValue({ data: { session: null } })

    const { getAccessTokenForMutation } = await import('./auth')
    expect(await getAccessTokenForMutation()).toBe('original-token')
  })
})
