import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/image', () => ({
  default: function ImgMock(props: { src: string; alt: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />
  }
}))

vi.mock('@/lib/articles/list', () => ({
  articleList: [
    {
      slug: 'with-thumb',
      title: 'With thumbnail',
      description: 'Has list image.',
      publishedAt: '2026-04-10T12:00:00.000Z',
      listImageSrc: '/articles/chime/chime-building.png'
    },
    {
      slug: 'no-thumb',
      title: 'No thumbnail',
      description: 'No list image field.',
      publishedAt: '2026-04-10T12:00:00.000Z'
    }
  ]
}))

describe('ArticlesIndexPage', () => {
  it('renders list rows with and without optional thumbnails', async () => {
    const { default: ArticlesIndexPage } = await import('./page')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<ArticlesIndexPage />)
    expect(html).toContain('Money Guides')
    expect(html).toContain('chime-building.png')
    expect(html).toContain('with-thumb')
    expect(html).toContain('no-thumb')
  })
})
