import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
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
        'components/home-clip-coupons.tsx',
        'components/stores-nav.tsx',
        'components/home-header.tsx',
        'components/home-footer.tsx',
        /* Embla + client effects: smoke-tested in hero-slider.test.tsx; v8 cannot execute hooks in SSR markup */
        'components/hero-slider.tsx',
        'components/store-card.tsx',
        'app/(home)/layout.tsx',
        '**/privacy/page.tsx',
        '**/terms/page.tsx',
        '**/categories/[slug]/page.tsx'
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
