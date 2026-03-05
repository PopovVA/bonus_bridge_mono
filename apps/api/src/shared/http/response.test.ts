import { describe, expect, it } from 'vitest'
import { apiOk } from './response'

describe('apiOk', () => {
  it('wraps payload', () => {
    expect(apiOk({ id: '1' })).toEqual({ ok: true, data: { id: '1' } })
  })
})
