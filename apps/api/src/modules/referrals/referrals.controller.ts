import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import {
  ReferralCreateSchema,
  ReferralsListQuerySchema,
  ReferralUpdateSchema
} from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { ReferralsService } from './referrals.service'

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly service: ReferralsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(ReferralCreateSchema))
  createReferral(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Get()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(ReferralsListQuerySchema))
  getReferrals(@Query() query: unknown) {
    return this.service.list(query as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(ReferralUpdateSchema))
  updateReferral(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }
}
