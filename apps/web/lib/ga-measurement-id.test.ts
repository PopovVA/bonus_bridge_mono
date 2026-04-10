import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGaMeasurementId } from './ga-measurement-id'

describe('getGaMeasurementId', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns default when env is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', undefined)
    expect(getGaMeasurementId()).toBe('G-9GPFJN1LKC')
  })

  it('returns trimmed env when set', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '  G-OTHER123  ')
    expect(getGaMeasurementId()).toBe('G-OTHER123')
  })
})
