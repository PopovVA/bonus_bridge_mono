import { describe, expect, it } from 'vitest'
import { normalizeText } from './normalize'
import { toSlug } from './slug'

describe('utils', () => {
  it('normalizeText trims and collapses spaces', () => {
    expect(normalizeText('  a  b  ')).toBe('a b')
  })

  it('toSlug lowercases and strips invalid chars', () => {
    expect(toSlug('Foo Bar')).toBe('foo-bar')
  })
})
