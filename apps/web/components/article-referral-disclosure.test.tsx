import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ArticleReferralDisclosure } from './article-referral-disclosure'

describe('ArticleReferralDisclosure', () => {
  it('renders the referral guide disclosure text', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<ArticleReferralDisclosure />)
    expect(html).toContain('article-page__referral-disclosure')
    expect(html).toContain('This guide explains how referral bonuses work')
  })
})
