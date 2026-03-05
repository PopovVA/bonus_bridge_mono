import { describe, expect, it } from 'vitest'
import { parsePagination } from './pagination'

describe('parsePagination', () => {
  it('returns defaults', () => {
    expect(parsePagination({})).toEqual({ limit: 20, offset: 0 })
  })

  it('enforces max limit and non-negative offset', () => {
    expect(parsePagination({ limit: 1000, offset: -5 })).toEqual({ limit: 100, offset: 0 })
  })
})
