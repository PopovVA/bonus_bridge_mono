import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { PremiumBannerCreateSchema, PremiumBannerUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { PremiumBannerService } from './premium-banner.service'

@Controller('premium-banner')
export class PremiumBannerController {
  constructor(private readonly service: PremiumBannerService) {}

  @Get()
  getActive() {
    return this.service.getActive()
  }

  @Get('all')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  list() {
    return this.service.list()
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(PremiumBannerCreateSchema))
  create(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(PremiumBannerUpdateSchema))
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
