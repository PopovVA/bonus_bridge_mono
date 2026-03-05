import { Controller, Get, UseGuards } from '@nestjs/common'
import { SupabaseAdminGuard } from 'src/auth/supabase-admin.guard'
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(SupabaseJwtGuard, SupabaseAdminGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  getUsers() {
    return this.service.list()
  }
}
