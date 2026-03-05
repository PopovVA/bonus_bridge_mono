import { describe, expect, it, vi } from 'vitest'
import { ReferralsController } from './referrals.controller'

describe('ReferralsController', () => {
  it('delegates create/list/update calls to service', async () => {
    const service = {
      create: vi.fn().mockResolvedValue({ id: '1' }),
      list: vi.fn().mockResolvedValue([{ id: '1' }]),
      update: vi.fn().mockResolvedValue({ id: '1', status: 'approved' })
    }
    const controller = new ReferralsController(service as never)

    await expect(controller.createReferral({ offerId: 'o1' })).resolves.toEqual({ id: '1' })
    await expect(controller.getReferrals({ status: 'pending' })).resolves.toEqual([{ id: '1' }])
    await expect(controller.updateReferral('1', { status: 'approved' })).resolves.toEqual({
      id: '1',
      status: 'approved'
    })
  })
})
