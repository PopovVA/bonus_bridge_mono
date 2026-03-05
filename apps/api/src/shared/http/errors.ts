import { HttpException, HttpStatus } from '@nestjs/common'

export function notFound(message: string): HttpException {
  return new HttpException({ ok: false, error: { code: 'NOT_FOUND', message } }, HttpStatus.NOT_FOUND)
}

export function badRequest(message: string): HttpException {
  return new HttpException({ ok: false, error: { code: 'BAD_REQUEST', message } }, HttpStatus.BAD_REQUEST)
}
