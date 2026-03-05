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
import { CategoryCreateSchema, CategoryUpdateSchema } from '@bonusbridge/shared'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { ZodValidationPipe } from 'src/shared/zod/zod-validation.pipe'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  getCategories() {
    return this.service.list()
  }

  @Post()
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(CategoryCreateSchema))
  createCategory(@Body() body: unknown) {
    return this.service.create(body as never)
  }

  @Patch(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  @UsePipes(new ZodValidationPipe(CategoryUpdateSchema))
  updateCategory(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body as never)
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
  deleteCategory(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
