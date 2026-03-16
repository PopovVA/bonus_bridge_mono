import { ExecutionContext } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'
import { SupabaseJwtGuard } from './supabase-jwt.guard'

const secret = 'test_secret'

function signExpired(payload: object) {
  return sign(payload, secret, { expiresIn: '-1s' })
}

describe('SupabaseJwtGuard', () => {
  const configService = {
    get: (key: string) => {
      if (key === 'SUPABASE_JWT_SECRET') return secret
      if (key === 'SUPABASE_JWT_ISSUER') return undefined
      if (key === 'SUPABASE_JWT_AUDIENCE') return undefined
      if (key === 'SUPABASE_URL') return undefined
      return undefined
    }
  }

  it('attaches parsed user', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u1', email: 'user@example.com', role: 'admin' }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect((request.user as { role: string }).role).toBe('admin')
  })

  it('rejects when bearer token missing', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} })
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).rejects.toThrow('Missing bearer token')
  })

  it('rejects when jwt secret is missing', async () => {
    const guard = new SupabaseJwtGuard({ get: () => undefined } as never)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer token' } })
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).rejects.toThrow('JWT secret is not configured')
  })

  it('rejects invalid token payload without subject', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ role: 'admin' }, secret)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } })
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).rejects.toThrow(/Invalid token payload|Invalid or expired token/)
  })

  it('maps admin role from app_metadata', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u2', app_metadata: { role: 'admin' } }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect((request.user as { role: string }).role).toBe('admin')
  })

  it('maps non-admin role to user', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u3', role: 'user' }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect((request.user as { role: string }).role).toBe('user')
  })

  it('rejects token signed with wrong secret', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u1' }, 'wrong_secret')
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } })
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).rejects.toThrow(/Invalid token/)
  })

  it('rejects expired token', async () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = signExpired({ sub: 'u1' })
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } })
      })
    } as ExecutionContext

    await expect(guard.canActivate(context)).rejects.toThrow('Token expired')
  })
})
