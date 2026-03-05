import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  },
  test: {
    include: ['app/**/*.test.ts', 'app/**/*.test.tsx', 'lib/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['app/**/*.ts', 'app/**/*.tsx', 'lib/**/*.ts'],
      exclude: ['app/admin/**', 'app/login/page.tsx', 'app/smoke.test.ts', 'lib/api/**'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    }
  }
})
