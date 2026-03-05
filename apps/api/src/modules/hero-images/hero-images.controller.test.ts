import { describe, expect, it, vi } from 'vitest'
import { HeroImagesController } from './hero-images.controller'

describe('HeroImagesController', () => {
  it('delegates CRUD calls to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new HeroImagesController(service as never)

    await expect(controller.getHeroImages()).resolves.toEqual([{ id: '1' }])
    await expect(
      controller.createHeroImage({
        imageUrl: 'https://example.com/img.jpg',
        sortOrder: 0
      })
    ).resolves.toEqual({ id: '2' })
    await expect(controller.updateHeroImage('id', { sortOrder: 1 })).resolves.toEqual({ id: '3' })
    await expect(controller.deleteHeroImage('id')).resolves.toEqual({ ok: true })
  })
})
