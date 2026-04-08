import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'dist/**', 'coverage/**']),
  {
    name: 'bonusbridge/single-app-font',
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'app/layout.tsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      'vitest.setup.ts'
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['next/font/google', 'next/font/local'],
              message:
                'Load fonts only in app/layout.tsx: one next/font family and one CSS variable (e.g. --font-app). Use var(--font-app) in CSS; do not add second font imports in layouts or components.'
            }
          ]
        }
      ]
    }
  }
])
