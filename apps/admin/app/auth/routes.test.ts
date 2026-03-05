import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const hasSupabaseEnv = vi.fn()
  const signInWithPassword = vi.fn()
  const signOut = vi.fn()
  const createSupabaseServerClient = vi.fn(async () => ({
    auth: {
      signInWithPassword,
      signOut
    }
  }))

  return { hasSupabaseEnv, signInWithPassword, signOut, createSupabaseServerClient }
})

vi.mock('@/lib/env', () => ({
  hasSupabaseEnv: mocks.hasSupabaseEnv
}))

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient
}))

import { POST as signInPost } from './sign-in/route'
import { POST as signOutPost } from './sign-out/route'

afterEach(() => {
  vi.clearAllMocks()
})

describe('admin auth routes', () => {
  it('redirects login when supabase env is missing', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(false)
    const request = new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'a@b.com',
        password: 'x',
        next: '/admin'
      })
    })

    const response = await signInPost(request)
    expect(response.headers.get('location')).toContain('/login?error=missing_supabase_env')
  })

  it('redirects to invalid_credentials when sign in fails', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(true)
    mocks.signInWithPassword.mockResolvedValueOnce({ error: new Error('bad creds') })
    const request = new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'a@b.com',
        password: 'x',
        next: '/admin'
      })
    })

    const response = await signInPost(request)
    expect(response.headers.get('location')).toContain('/login?error=invalid_credentials')
  })

  it('sanitizes next path and redirects after successful sign in', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(true)
    mocks.signInWithPassword.mockResolvedValueOnce({ error: null })
    const request = new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'a@b.com',
        password: 'x',
        next: 'https://evil.com'
      })
    })

    const response = await signInPost(request)
    expect(response.headers.get('location')).toBe('http://localhost/admin')
  })

  it('sanitizes protocol-relative next path', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(true)
    mocks.signInWithPassword.mockResolvedValueOnce({ error: null })
    const request = new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'a@b.com',
        password: 'x',
        next: '//evil'
      })
    })

    const response = await signInPost(request)
    expect(response.headers.get('location')).toBe('http://localhost/admin')
  })

  it('signs out only when supabase env exists', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(false)
    const request = new Request('http://localhost/auth/sign-out', { method: 'POST' })
    const response = await signOutPost(request)
    expect(response.headers.get('location')).toBe('http://localhost/login')
    expect(mocks.signOut).not.toHaveBeenCalled()

    mocks.hasSupabaseEnv.mockReturnValue(true)
    const response2 = await signOutPost(request)
    expect(response2.headers.get('location')).toBe('http://localhost/login')
    expect(mocks.signOut).toHaveBeenCalledOnce()
  })

  it('handles missing form fields with defaults', async () => {
    mocks.hasSupabaseEnv.mockReturnValue(true)
    mocks.signInWithPassword.mockResolvedValueOnce({ error: null })
    const request = new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      body: new URLSearchParams()
    })

    const response = await signInPost(request)
    expect(response.headers.get('location')).toBe('http://localhost/admin')
  })
})
