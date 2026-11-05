import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/image', () => ({
  default: function ImageMock(props: { src: string; alt: string }) {
    /* eslint-disable-next-line @next/next/no-img-element -- test double for next/image */
    return <img src={props.src} alt={props.alt} />
  }
}))
import HomePage, { metadata as homeMetadata } from './(home)/page'
import CategoryPage from './(default)/categories/[slug]/page'
import StorePage from './(default)/stores/[slug]/page'
import ChimeArticlePage from './(default)/articles/chime-1000-two-friends/page'
import {
  getAllHotCashbackOffers,
  getClientCatalog,
  getHeroSlides,
  getHomeClipCoupons,
  getOffers,
  getServices,
  getTopMonthlyOffers
} from '@/lib/site-data'

/** The only referral destinations authorized for removal from public promotion. */
const REMOVED_REFERRAL_URLS = [
  'https://py.pl/29jzHS',
  'https://share.public.com/Vadim66923',
  'https://invite.klarna.com/us/n33cxpeu/default-us'
] as const

const REMOVED_TOKENS = ['29jzHS', 'Vadim66923', 'n33cxpeu'] as const

/** Every other destination from the affiliate inventory, unchanged. */
const PRESERVED_REFERRAL_URLS = [
  'https://referrals.uber.com/refer?id=zfj232q2gjsx',
  'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
  'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
  'https://lime.bike/referral_signin/REGUD7BFJWT',
  'https://links.bird.co/rKbyq2',
  'https://lemonade.com/r/vadimpopov1',
  'https://posh.mk/QW6tN2UJW1b',
  'https://www.rakuten.com/r/MVADIM7',
  'https://www.topcashback.com/ref/member344836925437',
  'https://www.joinhoney.com/ref/nwpz6sw',
  'https://www.chime.com/r/vadimpopov1/',
  'https://join.robinhood.com/vadimp-4f32ef3',
  'https://smart.link/370flfia27552?cp_0=my1w2j',
  'https://coinbase.com/join/F2XRWRL?src=ios-link',
  'https://www.airbnb.com/'
] as const

const ALLOWED_NON_INVENTORY = ['https://example.com']

function walkSourceFiles(dir: string, acc: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'coverage') {
      continue
    }
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkSourceFiles(full, acc)
      continue
    }
    if (/\.test\./.test(entry.name)) continue
    if (!/\.(ts|tsx|js|jsx|md|css|json|html)$/.test(entry.name)) continue
    acc.push(full)
  }
}

describe('public referral surfaces', () => {
  it('keeps every other inventory URL and drops only the three removed promotions', async () => {
    const [offers, heroes, monthly, hot, clips, catalog] = await Promise.all([
      getOffers({ status: 'active' }),
      getHeroSlides(),
      getTopMonthlyOffers(),
      getAllHotCashbackOffers(),
      getHomeClipCoupons(),
      getClientCatalog()
    ])
    const found = new Set<string>()
    for (const offer of offers) found.add(offer.referralUrl)
    for (const slide of heroes) {
      if (slide.kind !== 'image') found.add(slide.referralUrl)
    }
    for (const row of monthly) found.add(row.href)
    for (const row of hot) found.add(row.href)
    for (const row of clips) found.add(row.openUrl)
    for (const category of catalog.categories) {
      for (const store of category.stores) {
        for (const offer of store.offers) found.add(offer.referralUrl)
      }
    }

    for (const url of REMOVED_REFERRAL_URLS) {
      expect(found.has(url)).toBe(false)
    }
    for (const url of PRESERVED_REFERRAL_URLS) {
      expect(found.has(url)).toBe(true)
    }
    const extras = [...found].filter(
      (url) => !PRESERVED_REFERRAL_URLS.includes(url as (typeof PRESERVED_REFERRAL_URLS)[number]) && !ALLOWED_NON_INVENTORY.includes(url)
    )
    expect(extras).toEqual([])
  })

  it('does not leave the removed referral URLs in shipped source outside tests', () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const files: string[] = []
    walkSourceFiles(repoRoot, files)
    const hits: string[] = []
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8')
      for (const token of REMOVED_TOKENS) {
        if (text.includes(token)) hits.push(`${path.relative(repoRoot, file)}:${token}`)
      }
    }
    expect(hits).toEqual([])
  })

  it('renders home, category, store, and article HTML without the removed links', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    const services = await getServices()
    const chunks = [
      renderToStaticMarkup(await HomePage()),
      renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'finance' }) })),
      renderToStaticMarkup(await ChimeArticlePage())
    ]
    for (const service of services) {
      chunks.push(renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: service.slug }) })))
    }
    const html = chunks.join('\n')
    for (const url of REMOVED_REFERRAL_URLS) {
      expect(html).not.toContain(url)
    }
    for (const token of REMOVED_TOKENS) {
      expect(html).not.toContain(token)
    }
    expect(html).toContain('<h1')
    expect(html).toContain('Referral guides and provider terms')
    expect(html).not.toContain('Open partner site?')
    expect(html).toContain('https://www.chime.com/r/vadimpopov1/')
    expect(html).toContain('https://referrals.uber.com/refer?id=zfj232q2gjsx')
    expect(html).toContain('https://coinbase.com/join/F2XRWRL?src=ios-link')
    expect(html).toContain('https://www.airbnb.com/')
    expect(html).toContain('https://www.klarna.com/')
    expect(html).toContain('https://public.com/')
    expect(html).toContain('not publicly promoting a referral link')
    expect(homeMetadata.openGraph).toMatchObject({ siteName: 'BonusBridge' })
    expect(homeMetadata.alternates).toMatchObject({ canonical: '/' })
    expect(homeMetadata.title).toBe('Referral guides and provider terms')
  })
})
