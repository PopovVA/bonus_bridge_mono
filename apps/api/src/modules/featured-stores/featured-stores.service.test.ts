import { describe, expect, it, vi } from 'vitest'
import { FeaturedStoresService } from './featured-stores.service'

describe('FeaturedStoresService', () => {
  it('delegates calls to repository', async () => {
    const repository = {
      findManyWithStore: vi.fn().mockResolvedValue([{ id: '1' }]),
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new FeaturedStoresService(repository as never)

    await expect(service.listForPublic()).resolves.toHaveLength(1)
    await expect(service.list()).resolves.toHaveLength(1)
    await expect(
      service.create({ storeId: '550e8400-e29b-41d4-a716-446655440000', sortOrder: 0 })
    ).resolves.toEqual({ id: '2' })
    await expect(service.update('id', { sortOrder: 1 })).resolves.toEqual({ id: '3' })
    await expect(service.remove('id')).resolves.toEqual({ ok: true })
  })
})
