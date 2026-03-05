import { Global, Module } from '@nestjs/common'
import { SupabaseJwtGuard } from './supabase-jwt.guard'
import { SupabaseAdminGuard } from './supabase-admin.guard'

@Global()
@Module({
  providers: [SupabaseJwtGuard, SupabaseAdminGuard],
  exports: [SupabaseJwtGuard, SupabaseAdminGuard]
})
export class AuthModule {}
