import { afterEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'

const track = vi.fn()

vi.mock('@/lib/gtag-track', () => ({
  trackGtagEvent: (...args: unknown[]) => track(...args)
}))

describe('ArticleViewTracker', () => {
  afterEach(() => {
    track.mockReset()
  })

  it('fires article_view once on mount', async () => {
    const { ArticleViewTracker } = await import('./article-view-tracker')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<ArticleViewTracker slug="test-article" />)
    })
    expect(track).toHaveBeenCalledWith('article_view', { article_slug: 'test-article' })
    root.unmount()
    el.remove()
  })
})
