import { describe, expect, it, vi } from 'vitest'
import { OffersController } from './offers.controller'

describe('Offers controller contract', () => {
  const service = {
    list: vi.fn().mockResolvedValue({ items: [], total: 0, limit: 20, offset: 0 }),
    getById: vi.fn().mockResolvedValue({ id: 'o1' }),
    create: vi.fn().mockResolvedValue({ id: 'o1' }),
    update: vi.fn().mockResolvedValue({ id: 'o1' }),
    remove: vi.fn().mockResolvedValue({ ok: true })
  }
  const controller = new OffersController(service as never)

  it('delegates list', async () => {
    const response = await controller.getOffers({} as never)
    expect(response).toEqual({ items: [], total: 0, limit: 20, offset: 0 })
  })

  it('delegates details and mutations', async () => {
    await expect(controller.getOfferById('o1')).resolves.toEqual({ id: 'o1' })
    await expect(controller.createOffer({} as never)).resolves.toEqual({ id: 'o1' })
    await expect(controller.updateOffer('o1', {} as never)).resolves.toEqual({ id: 'o1' })
    await expect(controller.deleteOffer('o1')).resolves.toEqual({ ok: true })
  })
})
