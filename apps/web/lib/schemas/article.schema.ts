import { z } from 'zod'
import { SlugSchema } from './common.schema'

export const ArticleListItemSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  publishedAt: z.string().datetime({ offset: true }),
  /** Public asset path for list cards (e.g. second hero image in the article). */
  listImageSrc: z.string().min(1).max(300).startsWith('/').optional()
})

export const ArticleListSchema = z.array(ArticleListItemSchema).min(1)

export type ArticleListItem = z.infer<typeof ArticleListItemSchema>
