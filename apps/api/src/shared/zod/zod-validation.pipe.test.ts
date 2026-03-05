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
})
