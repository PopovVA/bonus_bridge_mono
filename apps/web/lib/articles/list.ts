import { ArticleListSchema, type ArticleListItem } from '@/lib/schemas/article.schema'

export const articleList: ArticleListItem[] = ArticleListSchema.parse([
  {
    slug: 'chime-1000-two-friends',
    title: 'Open a Chime Account, Invite Two Friends, and Earn $1,000 Without Leaving Home',
    description:
      'Walk through a simple path to about $1,000 when you open through a referral and two friends set up qualifying direct deposits. Interactive profit calculator, why Chime funds these offers, and a clear checklist. Part one in our series on bank partner programs you can do from home.',
    publishedAt: '2026-04-10T12:00:00.000Z',
    listImageSrc: '/articles/chime/chime-building.png'
  }
])

export function getArticleBySlug(slug: string): ArticleListItem | undefined {
  return articleList.find((a) => a.slug === slug)
}
