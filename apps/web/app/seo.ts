import type { Metadata } from 'next'

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

/** Keep meta descriptions in a range search snippets can show without cutting mid-thought. */
export function clipMetaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const slice = clean.slice(0, max - 1)
  const cut = slice.lastIndexOf(' ')
  const base = (cut > 40 ? slice.slice(0, cut) : slice).replace(/[.,;:]+$/, '').trim()
  return `${base}…`
}

type SocialInput = {
  title: string
  description: string
  path: string
}

/** Title, description, canonical, and share tags. Does not invent an Open Graph image. */
export function pageSocialMetadata(input: SocialInput): Metadata {
  const description = clipMetaDescription(input.description)
  return {
    title: input.title,
    description,
    alternates: {
      canonical: input.path
    },
    openGraph: {
      title: input.title,
      description,
      url: absoluteUrl(input.path),
      siteName: 'BonusBridge',
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary',
      title: input.title,
      description
    }
  }
}

