import { describe, expect, it, vi } from 'vitest'
import { OffersController } from './offers.controller'

describe('OffersController', () => {
  it('delegates read and CRUD calls to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      getById: vi.fn().mockResolvedValue({ id: '1' }),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new OffersController(service as never)

    await expect(controller.getOffers({ status: 'active' })).resolves.toEqual([{ id: '1' }])
    await expect(controller.getOfferById('1')).resolves.toEqual({ id: '1' })
    await expect(controller.createOffer({ title: 't' })).resolves.toEqual({ id: '2' })
    await expect(controller.updateOffer('1', { title: 'u' })).resolves.toEqual({ id: '3' })
    await expect(controller.deleteOffer('1')).resolves.toEqual({ ok: true })
  })
})
