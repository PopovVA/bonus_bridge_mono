import { describe, expect, it, vi } from 'vitest'
import { ReferralsService } from './referrals.service'

describe('ReferralsService', () => {
  it('returns public shape from create and delegates list/update', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: 'r1', status: 'pending', secret: 'x' }),
      findMany: vi.fn().mockResolvedValue([{ id: 'r1' }]),
      update: vi.fn().mockResolvedValue({ id: 'r1', status: 'approved' })
    }
    const service = new ReferralsService(repository as never)

    await expect(service.create({ offerId: 'o1' } as never)).resolves.toEqual({ id: 'r1', status: 'pending' })
    await expect(service.list({} as never)).resolves.toEqual([{ id: 'r1' }])
    await expect(service.update('r1', { status: 'approved' } as never)).resolves.toEqual({
      id: 'r1',
      status: 'approved'
    })
  })
})
