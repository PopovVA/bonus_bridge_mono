import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/app/seo'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'

function priorityFor(path: string): number {
  if (path === '/') return 1
  if (path.startsWith('/stores/')) return 0.8
  if (path.startsWith('/guides/') || path.startsWith('/articles/') || path.startsWith('/categories/')) return 0.7
  if (path === '/articles' || path === '/guides') return 0.65
  return 0.4
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await listPublicSitemapPaths()
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly',
    priority: priorityFor(path)
  }))
}
