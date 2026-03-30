import { PremiumBannerUpdateSchema } from '@bonusbridge/shared'
import { BadRequestException } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ZodValidationPipe } from './zod-validation.pipe'

describe('ZodValidationPipe', () => {
  const schema = z.object({ name: z.string().min(1) })

  it('returns parsed payload', () => {
    const pipe = new ZodValidationPipe(schema)
    expect(pipe.transform({ name: 'john' }, {} as never)).toEqual({ name: 'john' })
  })

  it('throws bad request for invalid payload', () => {
    const pipe = new ZodValidationPipe(schema)
    expect(() => pipe.transform({ name: '' }, {} as never)).toThrow(BadRequestException)
  })

  it('parses JSON string when body is received as string', () => {
    const pipe = new ZodValidationPipe(schema)
    expect(pipe.transform('{"name":"john"}', {} as never)).toEqual({ name: 'john' })
  })

  it('parses JSON from Buffer when body is received as Buffer', () => {
    const pipe = new ZodValidationPipe(schema)
    expect(pipe.transform(Buffer.from('{"name":"john"}', 'utf8'), {} as never)).toEqual({ name: 'john' })
  })

  it('parses double-encoded JSON string', () => {
    const pipe = new ZodValidationPipe(schema)
    const doubleEncoded = JSON.stringify('{"name":"john"}')
    expect(pipe.transform(doubleEncoded, {} as never)).toEqual({ name: 'john' })
  })

  it('parses PremiumBannerUpdate payload as raw string (proxy flow)', () => {
    const pipe = new ZodValidationPipe(PremiumBannerUpdateSchema)
    const bodyStr = '{"title":"Join","description":"Desc","priceText":"$9","ctaText":"Start"}'
    expect(pipe.transform(bodyStr, {} as never)).toEqual({
      title: 'Join',
      description: 'Desc',
      priceText: '$9',
      ctaText: 'Start'
    })
  })
})
