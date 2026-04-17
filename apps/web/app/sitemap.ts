import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/app/seo'
import { articleList } from '@/lib/articles/list'
import { getCategories, getServices } from '@/lib/site-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, stores] = await Promise.all([getCategories().catch(() => []), getServices().catch(() => [])])

  const articleRoutes: MetadataRoute.Sitemap = ['/articles', ...articleList.map((a) => `/articles/${a.slug}`)].map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: 'weekly' as const,
      priority: path === '/articles' ? 0.65 : 0.7
    })
  )

  const baseRoutes: MetadataRoute.Sitemap = ['/', '/privacy-policy', '/terms-of-service', '/contact'].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.4
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    changeFrequency: 'daily',
    priority: 0.7
  }))

  const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
    url: absoluteUrl(`/stores/${store.slug}`),
    changeFrequency: 'daily',
    priority: 0.8
  }))

  return [...baseRoutes, ...articleRoutes, ...categoryRoutes, ...storeRoutes]
}

