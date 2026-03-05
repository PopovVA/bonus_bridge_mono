import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { AuthenticatedUser } from './auth.types'

@Injectable()
export class SupabaseAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>()
    if (request.user?.role !== 'admin') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Admin role required' })
    }

    return true
  }
}
