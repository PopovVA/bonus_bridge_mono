import { describe, expect, it } from 'vitest'
import { badRequest, notFound } from './errors'

describe('http errors helpers', () => {
  it('creates not found error', () => {
    const error = notFound('missing')
    expect(error.getStatus()).toBe(404)
  })

  it('creates bad request error', () => {
    const error = badRequest('bad')
    expect(error.getStatus()).toBe(400)
  })
})
