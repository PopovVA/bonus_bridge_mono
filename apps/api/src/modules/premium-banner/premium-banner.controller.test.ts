import { describe, expect, it, vi } from 'vitest'
import { PremiumBannerController } from './premium-banner.controller'

describe('PremiumBannerController', () => {
  it('delegates calls to service', async () => {
    const service = {
      getActive: vi.fn().mockResolvedValue({ id: '1', title: 'Join' }),
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      remove: vi.fn().mockResolvedValue({ ok: true })
    }
    const controller = new PremiumBannerController(service as never)

    await expect(controller.getActive()).resolves.toMatchObject({ title: 'Join' })
    await expect(controller.list()).resolves.toHaveLength(1)
    await expect(
      controller.create({
        title: 'Join',
        description: 'Desc',
        priceText: '$9',
        ctaText: 'Start'
      })
    ).resolves.toEqual({ id: '2' })
    await expect(controller.update('id', { title: 'Updated' })).resolves.toEqual({ id: '3' })
    await expect(controller.remove('id')).resolves.toEqual({ ok: true })
  })
})
