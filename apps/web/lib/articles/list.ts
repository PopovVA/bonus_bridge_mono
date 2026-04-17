import { ArticleListSchema, type ArticleListItem } from '@/lib/schemas/article.schema'

export const articleList: ArticleListItem[] = ArticleListSchema.parse([
  {
    slug: 'chime-1000-two-friends',
    title: 'Understanding Chime Referral Bonuses: Requirements, Estimates, and Official Terms',
    description:
      "Learn how Chime's invite-a-friend offer can work in example scenarios (including two qualifying friends and direct deposit), use an interactive estimate tool, and see requirements. Editorial overview only—bonus terms may vary; always confirm on Chime's official site.",
    publishedAt: '2026-04-10T12:00:00.000Z',
    listImageSrc: '/articles/chime/chime-building.png'
  }
])

export function getArticleBySlug(slug: string): ArticleListItem | undefined {
  return articleList.find((a) => a.slug === slug)
}
