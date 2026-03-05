import { describe, expect, it, vi } from 'vitest'
import { UsersController } from './users.controller'

describe('UsersController', () => {
  it('delegates list call to service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue([{ id: 'u1' }])
    }
    const controller = new UsersController(service as never)

    await expect(controller.getUsers()).resolves.toEqual([{ id: 'u1' }])
  })
})
