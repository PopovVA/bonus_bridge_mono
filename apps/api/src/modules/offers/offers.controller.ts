import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { OfferCreateSchema, OffersListQuerySchema, OfferUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { OffersService } from './offers.service'

@Controller('offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(OffersListQuerySchema))
  getOffers(@Query() query: unknown) {
    return this.service.list(query as never)
  }

  @Get(':id')
  getOfferById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(OfferCreateSchema))
  createOffer(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(OfferUpdateSchema))
  updateOffer(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  deleteOffer(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
