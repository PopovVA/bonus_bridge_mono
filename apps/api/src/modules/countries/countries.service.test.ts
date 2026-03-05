import { describe, expect, it, vi } from 'vitest'
import { CountriesService } from './countries.service'

describe('CountriesService', () => {
  it('delegates list/create/update/remove', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new CountriesService(repository as never)

    await expect(service.list()).resolves.toEqual([{ id: '1' }])
    await expect(service.create({ name: 'US', code: 'US' } as never)).resolves.toEqual({ id: '2' })
    await expect(service.update('1', { code: 'UA' } as never)).resolves.toEqual({ id: '3' })
    await expect(service.remove('1')).resolves.toEqual({ ok: true })
  })
})
