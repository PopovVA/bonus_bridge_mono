import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminApiClient } from './admin-client'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createAdminApiClient', () => {
  it('lists categories from envelope response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: '11111111-1111-1111-8111-111111111111',
              name: 'Fintech',
              slug: 'fintech',
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
    await expect(client.listCategories()).resolves.toEqual([
      {
        id: '11111111-1111-1111-8111-111111111111',
        name: 'Fintech',
        slug: 'fintech',
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
    await expect(client.listCategories()).rejects.toThrow('Admin API failed with 401')
  })

  describe('proxy path (PATCH/POST/DELETE)', () => {
    it('sends envelope with body as object (not double-stringified) to proxy', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'id1', title: 'Updated', description: 'D', priceText: '$9', ctaText: 'Go' })
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = createAdminApiClient('token', 'http://localhost:3000/api/admin/proxy')
      await client.updatePremiumBanner('id1', {
        title: 'Updated',
        description: 'D',
        priceText: '$9',
        ctaText: 'Go'
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, opts] = fetchMock.mock.calls[0]
      expect(url).toBe('http://localhost:3000/api/admin/proxy')
      expect(opts.method).toBe('POST')
      const envelope = JSON.parse(opts.body as string)
      expect(envelope.path).toBe('/premium-banner/id1')
      expect(envelope.method).toBe('PATCH')
      expect(envelope.body).toEqual({ title: 'Updated', description: 'D', priceText: '$9', ctaText: 'Go' })
      expect(typeof envelope.body).toBe('object')
    })
  })
})
