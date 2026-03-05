import { describe, expect, it, vi } from 'vitest'
import { CategoriesService } from './categories.service'

describe('CategoriesService', () => {
  it('delegates list/create/update/remove', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new CategoriesService(repository as never)

    await expect(service.list()).resolves.toEqual([{ id: '1' }])
    await expect(service.create({ name: 'crypto', slug: 'crypto' } as never)).resolves.toEqual({ id: '2' })
    await expect(service.update('1', { slug: 'payments' } as never)).resolves.toEqual({ id: '3' })
    await expect(service.remove('1')).resolves.toEqual({ ok: true })
  })
})
