import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/app/seo'
import { getCategories, getServices } from '@/lib/site-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, stores] = await Promise.all([getCategories().catch(() => []), getServices().catch(() => [])])

  const baseRoutes: MetadataRoute.Sitemap = ['/', '/privacy', '/terms'].map((path) => ({
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

  return [...baseRoutes, ...categoryRoutes, ...storeRoutes]
}

