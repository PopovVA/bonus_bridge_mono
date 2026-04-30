import { ArticleListSchema, type ArticleListItem } from '@/lib/schemas/article.schema'

export const articleList: ArticleListItem[] = ArticleListSchema.parse([
  {
    slug: 'chime-1000-two-friends',
    title: 'Understanding Chime Referral Offers: Requirements, Examples, and Official Terms',
    description:
      "Learn how Chime's invite-a-friend offer can work in example scenarios, review eligibility requirements, and compare the summary with Chime's official terms. Editorial overview only; offer terms may vary.",
    publishedAt: '2026-04-10T12:00:00.000Z',
    listImageSrc: '/articles/chime/chime-building.png'
  }
])

export function getArticleBySlug(slug: string): ArticleListItem | undefined {
  return articleList.find((a) => a.slug === slug)
}
