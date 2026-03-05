import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminApiClient } from './admin-client'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createAdminApiClient', () => {
  it('lists countries from envelope response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: '11111111-1111-1111-8111-111111111111',
              name: 'United States',
              code: 'US',
              createdAt: '2026-03-05T00:00:00.000Z',
              updatedAt: '2026-03-05T00:00:00.000Z'
            }
          ],
          total: 1,
          limit: 20,
          offset: 0
        })
      })
    )

    const client = createAdminApiClient('token')
    await expect(client.listCountries()).resolves.toEqual([
      {
        id: '11111111-1111-1111-8111-111111111111',
        name: 'United States',
        code: 'US',
        createdAt: '2026-03-05T00:00:00.000Z',
        updatedAt: '2026-03-05T00:00:00.000Z'
      }
    ])
  })

  it('throws on non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })
    )

    const client = createAdminApiClient('token')
    await expect(client.listCountries()).rejects.toThrow('Admin API failed with 401')
  })
})
