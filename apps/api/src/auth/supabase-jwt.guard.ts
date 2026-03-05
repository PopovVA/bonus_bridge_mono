import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'jsonwebtoken'
import { AuthenticatedUser } from './auth.types'

type JwtPayload = {
  sub?: string
  email?: string
  role?: string
  app_metadata?: {
    role?: string
  }
  [key: string]: unknown
}

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>
      user?: AuthenticatedUser
    }>()
    const token = this.extractBearerToken(request)

    if (!token) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Missing bearer token' })
    }

    const secret = this.configService.get<string>('SUPABASE_JWT_SECRET')
    if (!secret) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'JWT secret is not configured' })
    }

    const issuer = this.configService.get<string>('SUPABASE_JWT_ISSUER')
    const audience = this.configService.get<string>('SUPABASE_JWT_AUDIENCE')

    try {
      const payload = verify(token, secret, {
        issuer,
        audience
      }) as JwtPayload

      if (!payload.sub) {
        throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Invalid token payload' })
      }

      request.user = {
        sub: payload.sub,
        email: payload.email,
        role: this.resolveRole(payload),
        raw: payload
      }

      return true
    } catch {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' })
    }
  }

  private extractBearerToken(request: { headers: Record<string, string | undefined> }): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' && token ? token : null
  }

  private resolveRole(payload: JwtPayload): 'admin' | 'user' {
    const roleCandidate = payload.app_metadata?.role ?? payload.role
    return roleCandidate === 'admin' ? 'admin' : 'user'
  }
}
