import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  },
  test: {
    include: ['app/**/*.test.ts', 'app/**/*.test.tsx', 'lib/**/*.test.ts', 'components/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: [
        'app/**/*.tsx',
        'lib/**/*.ts',
        'components/**/*.tsx'
      ],
      exclude: [
        'lib/schemas/index.ts',
        'components/coupon-copy-button.tsx',
        'components/stores-nav.tsx',
        'components/home-header.tsx',
        'components/home-footer.tsx',
        'components/hero-slider.tsx',
        'app/(home)/layout.tsx',
        '**/privacy/page.tsx',
        '**/terms/page.tsx'
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
