import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Env, parseEnv } from './shared/config/env'

async function bootstrap() {
  const env: Env = parseEnv(process.env)
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = new Set(env.CORS_ALLOWED_ORIGINS)

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin is not allowed by CORS'))
    }
  })

  await app.listen(env.PORT)
}

void bootstrap()
