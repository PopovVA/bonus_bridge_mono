import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/image', () => ({
  default: function Img(props: { src: string; alt: string }) {
    return <img src={props.src} alt={props.alt} />
  }
}))

describe('ArticlePartnerFigure', () => {
  it('wraps the image in the partner referral link with analytics event', async () => {
    const { ArticlePartnerFigure } = await import('./article-partner-figure')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ArticlePartnerFigure
        articleSlug="chime-1000-two-friends"
        imageKey="referral_steps"
        src="/articles/chime/referral-steps.png"
        alt="Test alt"
        width={400}
        height={225}
        sizes="400px"
        caption="Caption text"
        partnerOfferCta
      />
    )
    expect(html).toContain('https://www.chime.com/r/vadimpopov1/')
    expect(html).toContain('referral-steps.png')
    expect(html).toContain('Caption text')
    expect(html).toContain('View offer details')
  })

  it('omits figcaption when caption is omitted', async () => {
    const { ArticlePartnerFigure } = await import('./article-partner-figure')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ArticlePartnerFigure
        articleSlug="chime-1000-two-friends"
        imageKey="referral_steps"
        src="/articles/chime/referral-steps.png"
        alt="Test alt"
        width={400}
        height={225}
        sizes="400px"
        partnerOfferCta
      />
    )
    expect(html).not.toContain('article-page__caption')
    expect(html).toContain('View offer details')
  })

  it('omits the offer button when partnerOfferCta is false', async () => {
    const { ArticlePartnerFigure } = await import('./article-partner-figure')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ArticlePartnerFigure
        articleSlug="chime-1000-two-friends"
        imageKey="building"
        src="/x.png"
        alt="Alt"
        width={400}
        height={267}
        sizes="400px"
        caption="Cap"
      />
    )
    expect(html).not.toContain('article-page__figure-cta')
  })
})
