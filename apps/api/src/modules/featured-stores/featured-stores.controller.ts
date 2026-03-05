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
import { FeaturedStoreCreateSchema, FeaturedStoreUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { FeaturedStoresService } from './featured-stores.service'

@Controller('featured-stores')
export class FeaturedStoresController {
  constructor(private readonly service: FeaturedStoresService) {}

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
  @UsePipes(new ZodValidationPipe(FeaturedStoreCreateSchema))
  create(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(FeaturedStoreUpdateSchema))
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
