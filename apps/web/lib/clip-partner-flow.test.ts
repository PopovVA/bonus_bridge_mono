import { afterEach, describe, expect, it, vi } from 'vitest'
import { tryWriteClipboard } from './clip-partner-flow'

describe('tryWriteClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when clipboard write succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    await expect(tryWriteClipboard('CODE')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('CODE')
  })

  it('returns false when clipboard write throws', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }
    })
    await expect(tryWriteClipboard('CODE')).resolves.toBe(false)
  })
})
