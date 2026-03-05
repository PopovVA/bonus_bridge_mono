import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/main.ts',
        'src/app.module.ts',
        'src/**/*.module.ts',
        'src/**/*.repository.ts',
        'src/shared/prisma/**',
        'src/auth/auth.module.ts',
        'src/auth/auth.types.ts',
        'src/auth/current-user.decorator.ts',
        'src/shared/http/serialize.ts'
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    }
  }
})
