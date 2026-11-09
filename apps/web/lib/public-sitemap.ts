import { articleList } from '@/lib/articles/list'
import { guideList } from '@/lib/guides'
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
    ...articleList.map((article) => `/articles/${article.slug}`),
    ...guideList.map((guide) => `/guides/${guide.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`),
    ...stores.map((store) => `/stores/${store.slug}`)
  ]
}
