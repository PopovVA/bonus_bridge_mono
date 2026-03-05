import { describe, expect, it, vi } from 'vitest'
import { PremiumBannerService } from './premium-banner.service'

describe('PremiumBannerService', () => {
  it('delegates calls to repository', async () => {
    const repository = {
      findFirst: vi.fn().mockResolvedValue({ id: '1' }),
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new PremiumBannerService(repository as never)

    await expect(service.getActive()).resolves.toEqual({ id: '1' })
    await expect(service.list()).resolves.toHaveLength(1)
    await expect(
      service.create({ title: 'Join', description: 'Desc', priceText: '$9', ctaText: 'Start' })
    ).resolves.toEqual({ id: '2' })
    await expect(service.update('id', { title: 'Updated' })).resolves.toEqual({ id: '3' })
    await expect(service.remove('id')).resolves.toEqual({ ok: true })
  })
})
