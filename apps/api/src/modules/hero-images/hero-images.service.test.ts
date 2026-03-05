import { describe, expect, it, vi } from 'vitest'
import { HeroImagesService } from './hero-images.service'

describe('HeroImagesService', () => {
  it('delegates CRUD calls to repository', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: '1' }]),
      create: vi.fn().mockResolvedValue({ id: '2' }),
      update: vi.fn().mockResolvedValue({ id: '3' }),
      delete: vi.fn().mockResolvedValue(undefined)
    }
    const service = new HeroImagesService(repository as never)

    await expect(service.list()).resolves.toHaveLength(1)
    await expect(
      service.create({ imageUrl: 'https://example.com/img.jpg', sortOrder: 0 })
    ).resolves.toEqual({ id: '2' })
    await expect(service.update('id', { sortOrder: 1 })).resolves.toEqual({ id: '3' })
    await expect(service.remove('id')).resolves.toEqual({ ok: true })
  })
})
