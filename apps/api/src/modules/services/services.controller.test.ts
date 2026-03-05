import { describe, expect, it, vi } from 'vitest'
import { ServicesController } from './services.controller'

describe('ServicesController', () => {
  it('delegates read and CRUD calls to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      getBySlug: vi.fn().mockResolvedValue({ id: 'svc' }),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new ServicesController(service as never)

    await expect(controller.getServices({ q: 'test' })).resolves.toEqual([{ id: '1' }])
    await expect(controller.getService('slug')).resolves.toEqual({ id: 'svc' })
    await expect(controller.createService({ name: 'X' })).resolves.toEqual({ id: '2' })
    await expect(controller.updateService('id', { name: 'Y' })).resolves.toEqual({ id: '3' })
    await expect(controller.deleteService('id')).resolves.toEqual({ ok: true })
  })
})
