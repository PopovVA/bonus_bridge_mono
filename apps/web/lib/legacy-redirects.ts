/**
 * Permanent redirects for store and category URLs that must not stay in the public catalog.
 * Next.js `statusCode: 301` (not `permanent: true`, which is 308).
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/stores/lemonade': '/categories/finance',
  '/stores/public': '/categories/finance',
  '/stores/klarna': '/categories/finance',
  '/stores/robinhood': '/categories/finance',
  '/stores/uber': '/categories/auto',
  '/stores/uber-eats': '/categories/shopping',
  '/stores/airbnb': '/disclosures',
  '/stores/visible': '/categories/electronics',
  '/stores/amex-hilton-honors': '/disclosures',
  '/categories/travel': '/disclosures',
  '/stores/7now': '/categories/shopping',
  '/stores/bird': '/categories/auto',
  '/stores/lime': '/categories/auto',
  '/stores/poshmark': '/categories/shopping',
  '/categories/food': '/categories/shopping',
  '/categories/food-dining': '/categories/shopping'
}

export function legacyRedirectDestination(pathname: string): string | null {
  return LEGACY_REDIRECTS[pathname] ?? null
}

export function legacyRedirectRules(): { source: string; destination: string; statusCode: 301 }[] {
  return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
    source,
    destination,
    statusCode: 301
  }))
}
