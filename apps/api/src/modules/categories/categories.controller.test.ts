import { describe, expect, it, vi } from 'vitest'
import { CategoriesController } from './categories.controller'

describe('CategoriesController', () => {
  it('delegates CRUD calls to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new CategoriesController(service as never)

    await expect(controller.getCategories()).resolves.toEqual([{ id: '1' }])
    await expect(controller.createCategory({ name: 'crypto', slug: 'crypto' })).resolves.toEqual({ id: '2' })
    await expect(controller.updateCategory('id', { slug: 'payments' })).resolves.toEqual({ id: '3' })
    await expect(controller.deleteCategory('id')).resolves.toEqual({ ok: true })
  })
})
