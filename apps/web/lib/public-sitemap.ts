import { articleDocuments, getArticleDocument } from '@/lib/articles/chime-document'
import { articleList } from '@/lib/articles/list'
import { getGuideBySlug, guideList } from '@/lib/guides'
import { latestPromoCheckedAt } from '@/lib/promo-entries'
import { promos } from '@/lib/promos'
import { getSignupBonus } from '@/lib/signup-bonuses'
import { getPublishedCategories, getServices } from '@/lib/site-data'

/** Paths that belong in the public sitemap. Unlisted stores and categories without stores are omitted. */
export async function listPublicSitemapPaths(): Promise<string[]> {
  const [categories, stores] = await Promise.all([getPublishedCategories(), getServices()])

  return [
    '/',
    '/privacy-policy',
    '/cookies',
    '/disclosures',
    '/terms-of-service',
    '/contact',
    '/articles',
    '/guides',
    '/promos',
    ...articleList.map((article) => `/articles/${article.slug}`),
    ...guideList.map((guide) => `/guides/${guide.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`),
    ...stores.map((store) => `/stores/${store.slug}`)
  ]
}

function latestIso(values: string[]): string | undefined {
  const sorted = values.filter(Boolean).sort()
  return sorted.at(-1)
}

/** Real content dates only. Pages without a checked or published date omit lastmod. */
export function lastModifiedForPath(path: string): string | undefined {
  if (path === '/guides') return latestIso(guideList.map((guide) => guide.updatedAt))
  if (path.startsWith('/guides/')) return getGuideBySlug(path.slice('/guides/'.length))?.updatedAt
  if (path === '/articles') {
    return latestIso([
      ...articleList.map((article) => article.publishedAt),
      ...articleDocuments.map((doc) => doc.updatedAt)
    ])
  }
  if (path.startsWith('/articles/')) return getArticleDocument(path.slice('/articles/'.length))?.updatedAt
  if (path === '/promos') return latestPromoCheckedAt(promos)
  if (path.startsWith('/stores/')) {
    const bonus = getSignupBonus(path.slice('/stores/'.length))
    return bonus ? `${bonus.checkedAt}T12:00:00.000Z` : undefined
  }
  return undefined
}
