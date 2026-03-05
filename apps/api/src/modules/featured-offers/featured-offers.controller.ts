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
import { FeaturedOfferCreateSchema, FeaturedOfferUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { FeaturedOffersService } from './featured-offers.service'

@Controller('featured-offers')
export class FeaturedOffersController {
  constructor(private readonly service: FeaturedOffersService) {}

  @Get()
  listForPublic() {
    return this.service.listForPublic()
  }

  @Get('admin')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  list() {
    return this.service.list()
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(FeaturedOfferCreateSchema))
  create(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(FeaturedOfferUpdateSchema))
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
