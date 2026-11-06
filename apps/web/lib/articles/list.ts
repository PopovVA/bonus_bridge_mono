import { ArticleListSchema, type ArticleListItem } from '@/lib/schemas/article.schema'

export const articleList: ArticleListItem[] = ArticleListSchema.parse([
  {
    slug: 'chime-1000-two-friends',
    title: 'Chime Referral Rules and Annual Cap',
    description:
      'Chime’s standard referral needs a $200 direct deposit within 45 days and card activation. Successful referrals are capped at 10 per calendar year.',
    publishedAt: '2026-04-10T12:00:00.000Z',
    listImageSrc: '/articles/chime/chime-building.png'
  }
])

export function getArticleBySlug(slug: string): ArticleListItem | undefined {
  return articleList.find((a) => a.slug === slug)
}
