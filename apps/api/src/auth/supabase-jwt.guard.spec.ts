import { ExecutionContext } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'
import { SupabaseJwtGuard } from './supabase-jwt.guard'

describe('SupabaseJwtGuard', () => {
  const secret = 'test_secret'
  const configService = {
    get: (key: string) => {
      if (key === 'SUPABASE_JWT_SECRET') return secret
      if (key === 'SUPABASE_JWT_ISSUER') return undefined
      if (key === 'SUPABASE_JWT_AUDIENCE') return undefined
      return undefined
    }
  }

  it('attaches parsed user', () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u1', email: 'user@example.com', role: 'admin' }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    expect(guard.canActivate(context)).toBe(true)
    expect((request.user as { role: string }).role).toBe('admin')
  })

  it('rejects when bearer token missing', () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} })
      })
    } as ExecutionContext

    expect(() => guard.canActivate(context)).toThrow('Missing bearer token')
  })

  it('rejects when jwt secret is missing', () => {
    const guard = new SupabaseJwtGuard({ get: () => undefined } as never)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer token' } })
      })
    } as ExecutionContext

    expect(() => guard.canActivate(context)).toThrow('JWT secret is not configured')
  })

  it('rejects invalid token payload without subject', () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ role: 'admin' }, secret)
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } })
      })
    } as ExecutionContext

    expect(() => guard.canActivate(context)).toThrow('Invalid or expired token')
  })

  it('maps admin role from app_metadata', () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u2', app_metadata: { role: 'admin' } }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    expect(guard.canActivate(context)).toBe(true)
    expect((request.user as { role: string }).role).toBe('admin')
  })

  it('maps non-admin role to user', () => {
    const guard = new SupabaseJwtGuard(configService as never)
    const token = sign({ sub: 'u3', role: 'user' }, secret)
    const request: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    expect(guard.canActivate(context)).toBe(true)
    expect((request.user as { role: string }).role).toBe('user')
  })
})
