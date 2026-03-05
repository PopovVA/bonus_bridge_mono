import { describe, expect, it, vi } from 'vitest'
import { OffersService } from './offers.service'

describe('OffersService', () => {
  it('delegates list/getById/create/update/remove', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      findById: vi.fn().mockResolvedValue({ id: '1' }),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new OffersService(repository as never)

    await expect(service.list({} as never)).resolves.toEqual([{ id: '1' }])
    await expect(service.getById('1')).resolves.toEqual({ id: '1' })
    await expect(service.create({ title: 'A' } as never)).resolves.toEqual({ id: '2' })
    await expect(service.update('1', { title: 'B' } as never)).resolves.toEqual({ id: '3' })
    await expect(service.remove('1')).resolves.toEqual({ ok: true })
  })

  it('throws when offer not found', async () => {
    const repository = {
      findMany: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    const service = new OffersService(repository as never)
    await expect(service.getById('missing')).rejects.toThrow('Http Exception')
  })
})
