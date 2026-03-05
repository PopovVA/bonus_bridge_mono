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
import {
  ServiceCreateSchema,
  ServicesListQuerySchema,
  ServiceUpdateSchema
} from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(ServicesListQuerySchema))
  getServices(@Query() query: unknown) {
    return this.service.list(query as never)
  }

  @Get(':slug')
  getService(@Param('slug') slug: string) {
    return this.service.getBySlug(slug)
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(ServiceCreateSchema))
  createService(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(ServiceUpdateSchema))
  updateService(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  deleteService(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
