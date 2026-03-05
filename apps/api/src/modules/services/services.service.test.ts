import { describe, expect, it, vi } from 'vitest'
import { ServicesService } from './services.service'

describe('ServicesService', () => {
  it('delegates list/getBySlug/create/update/remove', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      findBySlug: vi.fn().mockResolvedValue({ id: 'svc' }),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new ServicesService(repository as never)

    await expect(service.list({} as never)).resolves.toEqual([{ id: '1' }])
    await expect(service.getBySlug('slug')).resolves.toEqual({ id: 'svc' })
    await expect(service.create({ name: 'A' } as never)).resolves.toEqual({ id: '2' })
    await expect(service.update('1', { name: 'B' } as never)).resolves.toEqual({ id: '3' })
    await expect(service.remove('1')).resolves.toEqual({ ok: true })
  })

  it('throws when service by slug not found', async () => {
    const repository = {
      findMany: vi.fn(),
      findBySlug: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    const service = new ServicesService(repository as never)
    await expect(service.getBySlug('missing')).rejects.toThrow('Http Exception')
  })
})
