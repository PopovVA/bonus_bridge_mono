import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  JsonWebTokenError,
  TokenExpiredError,
  verify
} from 'jsonwebtoken'
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>
      user?: AuthenticatedUser
    }>()
    const token = this.extractBearerToken(request)

    if (!token) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Missing bearer token' })
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
    const secret = this.configService.get<string>('SUPABASE_JWT_SECRET')
    const issuer = this.configService.get<string>('SUPABASE_JWT_ISSUER')
    const audience = this.configService.get<string>('SUPABASE_JWT_AUDIENCE')

    let payload: JwtPayload

    try {
      payload = await this.verifyToken(token, supabaseUrl, secret, issuer, audience)
    } catch (err) {
      const message =
        err instanceof TokenExpiredError
          ? 'Token expired'
          : err instanceof JsonWebTokenError
            ? `Invalid token: ${err.message}`
            : err instanceof Error
              ? `Invalid token: ${err.message}`
              : 'Invalid or expired token'
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message })
    }

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
  }

  private async verifyToken(
    token: string,
    supabaseUrl: string | undefined,
    secret: string | undefined,
    issuer: string | undefined,
    audience: string | undefined
  ): Promise<JwtPayload> {
    if (supabaseUrl) {
      try {
        const { createRemoteJWKSet, jwtVerify } = await import('jose')
        const jwks = createRemoteJWKSet(
          new URL(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`)
        )
        const { payload } = await jwtVerify(token, jwks, {
          issuer: issuer || undefined,
          audience: audience || undefined
        })
        return payload as JwtPayload
      } catch {
        // JWKS failed (e.g. ES256 key not found, project uses legacy HS256) — fall through to legacy
      }
    }

    if (!secret) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'JWT secret is not configured' })
    }

    const payload = verify(token, secret, {
      issuer: issuer || undefined,
      audience: audience || undefined
    }) as JwtPayload
    return payload
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
