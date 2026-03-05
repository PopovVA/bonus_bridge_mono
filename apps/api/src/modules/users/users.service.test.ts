import { describe, expect, it, vi } from 'vitest'
import { UsersService } from './users.service'

describe('UsersService', () => {
  it('delegates list call', async () => {
    const repository = {
      findMany: vi.fn().mockResolvedValue([{ id: 'u1' }])
    }
    const service = new UsersService(repository as never)
    await expect(service.list()).resolves.toEqual([{ id: 'u1' }])
  })
})
