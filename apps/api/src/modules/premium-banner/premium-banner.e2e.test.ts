import type { NestExpressApplication } from '@nestjs/platform-express'
import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../app.module'
import { SupabaseAdminGuard } from '../../auth/supabase-admin.guard'
import { SupabaseJwtGuard } from '../../auth/supabase-jwt.guard'
import { PremiumBannerRepository } from './premium-banner.repository'

const mockAdminGuard = {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    req.user = { role: 'admin', sub: 'test', email: 'test@test.com' }
    return true
  }
}

/**
 * E2E: PATCH /premium-banner/:id with JSON body.
 * Matches production: default Nest JSON body + ZodValidationPipe.
 */
describe('PremiumBanner PATCH body parsing (e2e)', () => {
  let app: NestExpressApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(SupabaseJwtGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SupabaseAdminGuard)
      .useValue(mockAdminGuard)
      .overrideProvider(PremiumBannerRepository)
      .useValue({
        update: async (id: string, data: unknown) => ({ id, ...data, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() })
      })
      .compile()

    app = moduleRef.createNestApplication<NestExpressApplication>()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('accepts PATCH with JSON body', async () => {
    const payload = {
      title: 'Test Title',
      description: 'Test Description',
      priceText: '$9',
      ctaText: 'Start'
    }
    const res = await request(app.getHttpServer())
      .patch('/premium-banner/550e8400-e29b-41d4-a716-446655440000')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer fake-token')
      .send(payload)

    expect(res.status).not.toBe(400)
    if (res.status === 400) {
      // Log to debug
      console.error('Body parsing failed:', res.body)
    }
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(payload)
  })
})
