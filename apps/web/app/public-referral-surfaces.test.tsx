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
import sitemap from './sitemap'
import {
  getAllHotCashbackOffers,
  getClientCatalog,
  getHeroSlides,
  getHomeClipCoupons,
  getOffers,
  getServiceBySlug,
  getServices,
  getTopMonthlyOffers
} from '@/lib/site-data'
import { referralPrograms, unlistedStoreSlugs } from '@/lib/referral-programs'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'

/** Personal referral destinations that must not ship on public pages. */
const REMOVED_REFERRAL_URLS = [
  'https://py.pl/29jzHS',
  'https://share.public.com/Vadim66923',
  'https://invite.klarna.com/us/n33cxpeu/default-us',
  'https://referrals.uber.com/refer?id=zfj232q2gjsx',
  'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
  'https://lime.bike/referral_signin/REGUD7BFJWT',
  'https://links.bird.co/rKbyq2',
  'https://posh.mk/QW6tN2UJW1b',
  'https://join.robinhood.com/vadimp-4f32ef3',
  'https://smart.link/370flfia27552?cp_0=my1w2j',
  'https://coinbase.com/join/F2XRWRL?src=ios-link'
] as const

const REMOVED_TOKENS = [
  '29jzHS',
  'Vadim66923',
  'n33cxpeu',
  'zfj232q2gjsx',
  'eats-zywrn58e0v',
  'REGUD7BFJWT',
  'rKbyq2',
  'VADIMPOPOV',
  'QW6tN2UJW1b',
  'vadimp-4f32ef3',
  'my1w2j',
  '370flfia27552',
  'F2XRWRL',
  'X86GGD'
] as const

const PUBLIC_REFERRAL_URLS = [
  'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
  'https://www.rakuten.com/r/MVADIM7',
  'https://www.topcashback.com/ref/member344836925437',
  'https://www.joinhoney.com/ref/nwpz6sw',
  'https://www.chime.com/r/vadimpopov1/',
  'https://lemonade.com/r/vadimpopov1',
  'https://www.visible.com/get/?69PW6WF',
  'https://americanexpress.com/en-us/referral/hilton-honors?ref=VADIMP2XC4&xl=cp10o6'
] as const

const ALLOWED_NON_INVENTORY = ['https://example.com']

const UNLISTED_STORE_SLUGS = [
  'public',
  'klarna',
  'paypal',
  'robinhood',
  'uber',
  'uber-eats',
  'airbnb',
  '7now',
  'bird',
  'lime',
  'poshmark'
] as const

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
  it('publishes only bucket-1 referral URLs on home data and the client catalog', async () => {
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
    for (const url of PUBLIC_REFERRAL_URLS) {
      expect(found.has(url)).toBe(true)
    }
    const extras = [...found].filter(
      (url) =>
        !PUBLIC_REFERRAL_URLS.includes(url as (typeof PUBLIC_REFERRAL_URLS)[number]) &&
        !ALLOWED_NON_INVENTORY.includes(url)
    )
    expect(extras).toEqual([])

    const publicSlugs = new Set(referralPrograms.filter((program) => program.publicOk).map((program) => program.slug))
    for (const category of catalog.categories) {
      for (const store of category.stores) {
        expect(publicSlugs.has(store.slug)).toBe(true)
      }
    }
  })

  it('keeps unlisted stores out of the sitemap, homepage, and category grids', async () => {
    const paths = await listPublicSitemapPaths()
    const entries = await sitemap()
    const urls = entries.map((entry) => entry.url).join('\n')
    for (const slug of UNLISTED_STORE_SLUGS) {
      expect(paths).not.toContain(`/stores/${slug}`)
      expect(urls).not.toContain(`/stores/${slug}`)
    }
    expect(paths).toContain('/stores/rakuten')
    expect(paths).toContain('/stores/chime')
    expect(paths).toContain('/guides/rakuten-vs-topcashback')
    expect(paths).toContain('/cookies')
    expect(paths).toContain('/disclosures')
    expect(unlistedStoreSlugs()).toEqual(expect.arrayContaining([...UNLISTED_STORE_SLUGS]))

    ;(globalThis as { React?: typeof React }).React = React
    const home = renderToStaticMarkup(await HomePage())
    const shopping = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'shopping' }) }))
    const finance = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'finance' }) }))
    const auto = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'auto' }) }))
    const grids = `${home}\n${shopping}\n${finance}\n${auto}`
    expect(grids).not.toContain('/stores/uber')
    expect(grids).not.toContain('/stores/robinhood')
    expect(grids).not.toContain('/stores/klarna')
    expect(grids).toContain('/stores/rakuten')
    expect(grids).toContain('/stores/chime')
    for (const token of REMOVED_TOKENS) {
      expect(grids).not.toContain(token)
    }
  })

  it('does not leave removed referral URLs in shipped source outside tests', () => {
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

  it('renders home, category, store, and article HTML without removed links', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    const services = await getServices()
    const chunks = [
      renderToStaticMarkup(await HomePage()),
      renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'finance' }) })),
      renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'shopping' }) })),
      renderToStaticMarkup(await ChimeArticlePage()),
      JSON.stringify(await getClientCatalog())
    ]
    for (const service of services) {
      chunks.push(renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: service.slug }) })))
    }
    for (const slug of unlistedStoreSlugs()) {
      try {
        await getServiceBySlug(slug)
      } catch {
        continue
      }
      chunks.push(renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug }) })))
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
    expect(html).toContain('https://www.rakuten.com/r/MVADIM7')
    expect(html).toContain('not publicly promoting a referral link')
    expect(html).toContain('independent comparison and guide site')
    expect(homeMetadata.openGraph).toMatchObject({ siteName: 'BonusBridge' })
    expect(homeMetadata.alternates).toMatchObject({ canonical: '/' })
    expect(homeMetadata.title).toBe('Referral guides and provider terms')
  })
})
