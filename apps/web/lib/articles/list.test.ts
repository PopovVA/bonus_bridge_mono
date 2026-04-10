import { describe, expect, it } from 'vitest'
import { articleList, getArticleBySlug } from './list'

describe('articleList', () => {
  it('exposes the Chime guide', () => {
    expect(articleList.some((a) => a.slug === 'chime-1000-two-friends')).toBe(true)
  })

  it('getArticleBySlug returns undefined for unknown slugs', () => {
    expect(getArticleBySlug('no-such-article')).toBeUndefined()
  })

  it('getArticleBySlug returns a record for known slugs', () => {
    const a = getArticleBySlug('chime-1000-two-friends')
    expect(a?.title).toContain('Chime')
  })
})
