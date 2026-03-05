import { describe, expect, it, vi } from 'vitest'
import { CountriesController } from './countries.controller'

describe('CountriesController', () => {
  it('delegates CRUD calls to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new CountriesController(service as never)

    await expect(controller.getCountries()).resolves.toEqual([{ id: '1' }])
    await expect(controller.createCountry({ name: 'US', code: 'US' })).resolves.toEqual({ id: '2' })
    await expect(controller.updateCountry('id', { code: 'UA' })).resolves.toEqual({ id: '3' })
    await expect(controller.deleteCountry('id')).resolves.toEqual({ ok: true })
  })
})
