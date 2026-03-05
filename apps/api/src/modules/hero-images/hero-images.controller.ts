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
import { HeroImageCreateSchema, HeroImageUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { HeroImagesService } from './hero-images.service'

@Controller('hero-images')
export class HeroImagesController {
  constructor(private readonly service: HeroImagesService) {}

  @Get()
  getHeroImages() {
    return this.service.list()
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(HeroImageCreateSchema))
  createHeroImage(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(HeroImageUpdateSchema))
  updateHeroImage(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  deleteHeroImage(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
