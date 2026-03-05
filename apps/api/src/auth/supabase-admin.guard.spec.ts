import { ExecutionContext } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { SupabaseAdminGuard } from './supabase-admin.guard'

describe('SupabaseAdminGuard', () => {
  const guard = new SupabaseAdminGuard()

  const contextForRole = (role?: 'admin' | 'user') =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role, sub: 'user-id', raw: {} } : undefined
        })
      })
    }) as ExecutionContext

  it('allows admin user', () => {
    expect(guard.canActivate(contextForRole('admin'))).toBe(true)
  })

  it('rejects non-admin user', () => {
    expect(() => guard.canActivate(contextForRole('user'))).toThrow('Admin role required')
  })

  it('rejects request without user', () => {
    expect(() => guard.canActivate(contextForRole())).toThrow('Admin role required')
  })
})
