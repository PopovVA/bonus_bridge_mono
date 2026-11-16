import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  activePromosForStore,
  checkedLabel,
  endLabel,
  formatCheckedDay,
  formatPromoDate,
  formatPromoInstant,
  groupPromos,
  latestPromoCheckedAt,
  promoStatus,
  renderPromoEntryMarkdown,
  renderPromosMarkdown,
  storePromoMarkdown,
  toPromoCard,
  withStorePromoMarkdown,
  type PromoCardModel
} from './promo-entries'
import { promos } from './promos'
import { parsePromos, type Promo } from './schemas/promo.schema'

const NOW = new Date('2026-11-16T18:00:00.000Z')

function promo(overrides: Record<string, unknown> = {}): Promo {
  const [row] = parsePromos([
    {
      id: 'sample-offer',
      store: 'Example Store',
      title: 'Sample offer',
      description: 'A checked offer.',
      terms: 'See the official page.',
      url: 'https://example.com/terms',
      expiresAt: '2099-01-01T00:00:00Z',
      source: 'brand newsletter',
      checkedAt: '2026-03-02',
      ...overrides
    }
  ])
  return row
}

function card(overrides: Partial<PromoCardModel> = {}): PromoCardModel {
  return {
    id: 'card',
    store: 'Example Store',
    storeSlug: 'example-store',
    storeHref: null,
    title: 'Sample offer',
    code: 'SAVE',
    description: 'A checked offer.',
    terms: 'See the official page.',
    url: 'https://example.com/terms',
    startsAt: null,
    expiresAt: '2099-01-01T00:00:00Z',
    source: 'brand newsletter',
    checkedAt: '2026-03-02',
    category: null,
    ...overrides
  }
}

describe('promo file schema', () => {
  it('loads an empty live file and accepts the documented example', () => {
    expect(promos).toEqual([])
    const readme = fs.readFileSync(path.resolve(import.meta.dirname, '../content/README.md'), 'utf8')
    const match = readme.match(/```json\n([\s\S]*?)\n```/)
    if (!match) throw new Error('missing example')
    const example = parsePromos(JSON.parse(match[1]))
    expect(example.map((item) => item.id)).toEqual(['example-store-spring', 'example-store-ongoing'])
    expect(example[1]?.code).toBeNull()
    expect(example[1]?.expiresAt).toBeNull()
    const trimmed = promo({ id: 'trimmed-code', code: '  SAVE10  ', url: 'http://example.com/offer' })
    expect(trimmed.code).toBe('SAVE10')
    expect(trimmed.url).toBe('http://example.com/offer')
    const minimal = promo({ id: 'minimal-offer' })
    expect(minimal.storeSlug).toBeUndefined()
    expect(minimal.startsAt).toBeUndefined()
  })

  it('rejects malformed files with a path and a message', () => {
    expect(() => parsePromos({})).toThrow(/Invalid promos file: \(file\)/)
    expect(() => parsePromos([promo({ id: 'same' }), { ...promo({ id: 'same' }) }])).toThrow(/Duplicate id "same"/)
    expect(() =>
      parsePromos([
        promo({
          id: 'backwards',
          startsAt: '2026-04-02T00:00:00Z',
          expiresAt: '2026-04-01T00:00:00Z'
        })
      ])
    ).toThrow(/expiresAt must be later than startsAt/)
    expect(() => parsePromos([promo({ id: 'ftp-offer', url: 'ftp://example.com/offer' })])).toThrow(/http or https/)
    expect(() => parsePromos([promo({ id: 'js-offer', url: 'javascript:alert(1)' })])).toThrow(/http or https/)
    expect(() => parsePromos([promo({ id: 'blank-code', code: '   ' })])).toThrow(/Invalid promos file/)
    expect(() => parsePromos([promo({ id: 'bad-day', checkedAt: '2026-02-31' })])).toThrow(/Invalid promos file/)
    expect(() => parsePromos([promo({ id: 'local-time', expiresAt: '2026-12-01T00:00:00' })])).toThrow(
      /Invalid promos file/
    )
    expect(() => parsePromos([promo({ id: 'extra', note: 'nope' })])).toThrow(/Invalid promos file/)
  })
})

describe('promo status and labels', () => {
  const base = promo({ id: 'status-offer', startsAt: '2026-11-01T00:00:00Z', expiresAt: '2026-12-01T00:00:00Z' })

  it('classifies upcoming, active, and expired, including the exact boundary', () => {
    expect(promoStatus(base, NOW)).toBe('active')
    expect(promoStatus({ ...base, startsAt: '2026-12-01T00:00:00Z', expiresAt: '2026-12-02T00:00:00Z' }, NOW)).toBe(
      'upcoming'
    )
    expect(promoStatus({ ...base, expiresAt: '2026-11-01T00:00:00Z' }, NOW)).toBe('expired')
    expect(promoStatus({ ...base, startsAt: null, expiresAt: null }, NOW)).toBe('active')
    expect(promoStatus({ ...base, startsAt: '2026-12-01T00:00:00Z', expiresAt: null }, NOW)).toBe('upcoming')
    expect(promoStatus({ expiresAt: '2026-01-01T00:00:00Z' }, NOW)).toBe('expired')
    expect(promoStatus({ ...base, startsAt: NOW.toISOString() }, NOW)).toBe('active')
    expect(promoStatus({ ...base, expiresAt: NOW.toISOString() }, NOW)).toBe('expired')
  })

  it('formats instants in the timezone written on the value', () => {
    expect(formatPromoInstant('2026-03-31T23:59:00-05:00')).toBe('Mar 31, 2026, 11:59 PM UTC-5')
    expect(formatPromoDate('2026-03-31T23:59:00-05:00')).toBe('Mar 31, 2026')
    expect(formatPromoInstant('2026-04-01T00:30:00+05:30')).toBe('Apr 1, 2026, 12:30 AM UTC+5:30')
    expect(formatPromoInstant('2026-06-15T12:00:00Z')).toBe('Jun 15, 2026, 12:00 PM UTC')
    expect(formatPromoInstant('2026-06-15T00:00:00Z')).toBe('Jun 15, 2026, 12:00 AM UTC')
    expect(formatPromoInstant('2026-06-15T15:05:00+00:00')).toBe('Jun 15, 2026, 3:05 PM UTC')
    expect(formatPromoInstant('2026-01-01T00:30:00+00:30')).toBe('Jan 1, 2026, 12:30 AM UTC+0:30')
    expect(formatPromoInstant('nope')).toBe('Invalid date')
    expect(formatPromoDate('nope')).toBe('Invalid date')
    const zoneless = '2026-01-02T15:04:05'
    const parsed = new Date(Date.parse(zoneless))
    const rawHour = parsed.getUTCHours()
    const hour = rawHour % 12 || 12
    const minute = String(parsed.getUTCMinutes()).padStart(2, '0')
    const suffix = rawHour >= 12 ? 'PM' : 'AM'
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    expect(formatPromoInstant(zoneless)).toBe(
      `${months[parsed.getUTCMonth()]} ${parsed.getUTCDate()}, ${parsed.getUTCFullYear()}, ${hour}:${minute} ${suffix} UTC`
    )
  })

  it('formats checked dates and end labels', () => {
    expect(formatCheckedDay('2026-11-09')).toBe('Nov 9, 2026')
    expect(formatCheckedDay('nope')).toBe('Invalid date')
    expect(formatCheckedDay('2026-13-01')).toBe('Invalid date')
    expect(formatCheckedDay('2026-03-00')).toBe('Invalid date')
    expect(checkedLabel('2026-03-02')).toBe('Checked Mar 2, 2026')
    expect(endLabel(null)).toBe('No set end date')
    expect(endLabel('2026-06-15T12:00:00Z')).toBe('Expires Jun 15, 2026, 12:00 PM UTC')
  })

  it('links a store only when the slug is public', () => {
    const linked = toPromoCard(promo({ id: 'linked', storeSlug: 'rakuten', code: null, category: 'shopping' }), new Set(['rakuten']))
    expect(linked.storeHref).toBe('/stores/rakuten')
    expect(linked.storeSlug).toBe('rakuten')
    expect(linked.code).toBeNull()
    expect(linked.category).toBe('shopping')
    const unknown = toPromoCard(promo({ id: 'unknown-store', storeSlug: 'example-store' }), new Set(['rakuten']))
    expect(unknown.storeHref).toBeNull()
    expect(unknown.storeSlug).toBe('example-store')
    const plain = toPromoCard(promo({ id: 'plain' }), new Set(['rakuten']))
    expect(plain.storeHref).toBeNull()
    expect(plain.storeSlug).toBe('example-store')
    expect(plain.startsAt).toBeNull()
  })
})

describe('promo grouping and markdown', () => {
  it('sorts active by soonest expiry, upcoming by start, and expired by most recent', () => {
    const items = [
      card({ id: 'ongoing-m', store: 'Middle', expiresAt: null, startsAt: null }),
      card({ id: 'dated-soon', store: 'Zulu', expiresAt: '2026-11-20T00:00:00Z' }),
      card({ id: 'dated-late-c', store: 'Alpha', expiresAt: '2026-12-01T00:00:00Z' }),
      card({ id: 'dated-late-a', store: 'Alpha', expiresAt: '2026-12-01T00:00:00Z' }),
      card({ id: 'dated-late-b', store: 'Beta', expiresAt: '2026-12-01T00:00:00Z' }),
      card({ id: 'ongoing-a', store: 'Alpha', expiresAt: null }),
      card({
        id: 'up-late-c',
        store: 'Alpha',
        startsAt: '2027-01-01T00:00:00Z',
        expiresAt: '2027-02-01T00:00:00Z'
      }),
      card({
        id: 'up-soon',
        store: 'Zulu',
        startsAt: '2026-12-01T00:00:00Z',
        expiresAt: '2027-01-01T00:00:00Z'
      }),
      card({
        id: 'up-late-a',
        store: 'Alpha',
        startsAt: '2027-01-01T00:00:00Z',
        expiresAt: '2027-02-01T00:00:00Z'
      }),
      card({
        id: 'up-late-m',
        store: 'Middle',
        startsAt: '2027-01-01T00:00:00Z',
        expiresAt: '2027-02-01T00:00:00Z'
      }),
      card({ id: 'old-a', store: 'Alpha', expiresAt: '2026-01-01T00:00:00Z' }),
      card({ id: 'new-z2', store: 'Zulu', expiresAt: '2026-06-01T00:00:00Z' }),
      card({ id: 'new-m', store: 'Middle', expiresAt: '2026-06-01T00:00:00Z' }),
      card({ id: 'new-z', store: 'Zulu', expiresAt: '2026-06-01T00:00:00Z' })
    ]
    const grouped = groupPromos(items, NOW)
    expect(grouped.active.map((item) => item.id)).toEqual([
      'dated-soon',
      'dated-late-a',
      'dated-late-c',
      'dated-late-b',
      'ongoing-a',
      'ongoing-m'
    ])
    expect(grouped.upcoming.map((item) => item.id)).toEqual(['up-soon', 'up-late-a', 'up-late-c', 'up-late-m'])
    expect(grouped.expired.map((item) => item.id)).toEqual(['new-m', 'new-z', 'new-z2', 'old-a'])
  })

  it('keeps only active promos for a store', () => {
    const rows = [
      promo({ id: 'mine', storeSlug: 'rakuten' }),
      promo({ id: 'other', storeSlug: 'chime' }),
      promo({ id: 'later', storeSlug: 'rakuten', startsAt: '2099-01-01T00:00:00Z', expiresAt: '2099-02-01T00:00:00Z' }),
      promo({ id: 'old', storeSlug: 'rakuten', expiresAt: '2000-01-01T00:00:00Z' })
    ]
    expect(activePromosForStore('rakuten', rows, NOW).map((item) => item.id)).toEqual(['mine'])
    expect(latestPromoCheckedAt([])).toBeUndefined()
    expect(latestPromoCheckedAt([{ checkedAt: '2026-03-02' }, { checkedAt: '2026-11-16' }])).toBe(
      '2026-11-16T12:00:00.000Z'
    )
  })

  it('renders markdown for each status and skips empty sections', () => {
    const active = renderPromoEntryMarkdown(
      card({ code: 'SAVE', storeHref: '/stores/rakuten', expiresAt: '2026-12-01T00:00:00Z' }),
      'active'
    ).join('\n')
    expect(active).toContain('Code: SAVE')
    expect(active).toContain('https://bonusbridge.io/stores/rakuten')
    expect(active).toContain('Expires Dec 1, 2026, 12:00 AM UTC')

    const open = renderPromoEntryMarkdown(card({ code: null, expiresAt: null, storeHref: null }), 'active').join('\n')
    expect(open).toContain('No code required.')
    expect(open).toContain('No set end date.')
    expect(open).not.toContain('Store page')

    const upcoming = renderPromoEntryMarkdown(
      card({ startsAt: '2026-12-01T00:00:00Z', expiresAt: null }),
      'upcoming'
    ).join('\n')
    expect(upcoming).toContain('Starts Dec 1, 2026, 12:00 AM UTC')

    const upcomingBlank = renderPromoEntryMarkdown(card({ startsAt: null, expiresAt: null }), 'upcoming').join('\n')
    expect(upcomingBlank).toContain('Starts Invalid date')

    const expired = renderPromoEntryMarkdown(card({ expiresAt: '2026-01-02T00:00:00Z' }), 'expired').join('\n')
    expect(expired).toContain('Expired Jan 2, 2026')
    expect(expired).not.toContain('Expires')

    const expiredBlank = renderPromoEntryMarkdown(card({ expiresAt: null }), 'expired').join('\n')
    expect(expiredBlank).toContain('Expired Invalid date')

    expect(renderPromosMarkdown([], NOW)).toContain('No promo codes are listed right now.')
    expect(renderPromosMarkdown([], NOW)).not.toContain('## Active')

    const onlyActive = renderPromosMarkdown([promo({ id: 'only-active', title: 'Only active' })], NOW)
    expect(onlyActive).toContain('## Active')
    expect(onlyActive).not.toContain('## Expired')
    expect(onlyActive).not.toContain('## Starts later')

    const mixed = renderPromosMarkdown(
      [
        promo({ id: 'live', title: 'Live offer', storeSlug: 'rakuten' }),
        promo({
          id: 'future',
          title: 'Future offer',
          startsAt: '2026-12-01T00:00:00Z',
          expiresAt: '2026-12-31T00:00:00Z'
        }),
        promo({ id: 'gone', title: 'Gone offer', expiresAt: '2026-01-01T00:00:00Z' })
      ],
      NOW,
      new Set(['rakuten'])
    )
    expect(mixed).toContain('## Active')
    expect(mixed).toContain('## Starts later')
    expect(mixed).toContain('## Expired')
    expect(mixed).toContain('https://bonusbridge.io/stores/rakuten')

    expect(storePromoMarkdown('rakuten', [promo({ id: 'other', storeSlug: 'chime' })], NOW)).toBe('')
    const storeBlock = storePromoMarkdown('rakuten', [promo({ id: 'mine', storeSlug: 'rakuten', code: 'SHOP' })], NOW)
    expect(storeBlock).toContain('## Promo codes')
    expect(storeBlock).toContain('Code: SHOP')
    expect(withStorePromoMarkdown('# Store\n', 'rakuten', [], NOW)).toBe('# Store\n')
    expect(withStorePromoMarkdown('# Store\n', 'rakuten', [promo({ id: 'mine', storeSlug: 'rakuten' })], NOW)).toContain(
      '## Promo codes'
    )
  })
})
