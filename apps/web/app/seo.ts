const DEFAULT_SITE_URL = 'https://bonusbridge.io'

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const raw = fromEnv || DEFAULT_SITE_URL
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

