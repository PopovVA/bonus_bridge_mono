import { describe, expect, it } from 'vitest'
import { HealthController } from './health.controller'

describe('Health integration', () => {
  it('returns ok payload', () => {
    const controller = new HealthController()
    expect(controller.getHealth()).toEqual({ ok: true })
  })
})
