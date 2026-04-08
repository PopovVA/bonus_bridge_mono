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
        'components/home-clip-coupons.tsx',
        'components/clip-coupon-card.tsx',
        'components/stores-nav.tsx',
        'components/home-header.tsx',
        'components/store-name-search.tsx',
        'components/home-footer.tsx',
        'components/client-catalog-provider.tsx',
        'components/store-related-panel.tsx',
        'components/store-offer-clip-cards.tsx',
        'components/store-related-offer-cards.tsx',
        'components/store-top-offers.tsx',
        'components/clip-open-store-dialog.tsx',
        'components/use-clip-partner-offer-flow.ts',
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
