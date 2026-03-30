import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    let parsed: unknown = value
    if (typeof value === 'string' || Buffer.isBuffer(value)) {
      try {
        const str = typeof value === 'string' ? value : value.toString('utf8')
        parsed = str
        while (typeof parsed === 'string') {
          parsed = JSON.parse(parsed)
        }
      } catch {
        // fall through to validation, will fail with clearer error
      }
    }
    const result = this.schema.safeParse(parsed)
    if (!result.success) {
      throw new BadRequestException({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: result.error.flatten()
        }
      })
    }

    return result.data
  }
}
