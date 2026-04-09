import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGaMeasurementId, shouldLoadGoogleAnalytics } from './ga-measurement-id'

describe('shouldLoadGoogleAnalytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is false when NODE_ENV is development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(shouldLoadGoogleAnalytics()).toBe(false)
  })

  it('is true when NODE_ENV is production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(shouldLoadGoogleAnalytics()).toBe(true)
  })
})

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
