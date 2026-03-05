import { describe, expect, it, vi } from 'vitest'
import { FeaturedStoresController } from './featured-stores.controller'

describe('FeaturedStoresController', () => {
  it('delegates calls to service', async () => {
    const service = {
      listForPublic: vi.fn().mockResolvedValue([{ id: '1', store: { name: 'Store' } }]),
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new FeaturedStoresController(service as never)

    await expect(controller.listForPublic()).resolves.toHaveLength(1)
    await expect(controller.list()).resolves.toHaveLength(1)
    await expect(
      controller.create({ storeId: '550e8400-e29b-41d4-a716-446655440000', sortOrder: 0 })
    ).resolves.toEqual({ id: '2' })
    await expect(controller.update('id', { sortOrder: 1 })).resolves.toEqual({ id: '3' })
    await expect(controller.remove('id')).resolves.toEqual({ ok: true })
  })
})
