import { absoluteUrl } from '@/app/seo'
import type { Promo } from '@/lib/schemas/promo.schema'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { toSlug } from '@/lib/utils/slug'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type PromoStatus = 'upcoming' | 'active' | 'expired'

export type PromoCardModel = {
  id: string
  store: string
  /** Public store slug, or the store name slugified when the page does not exist. */
  storeSlug: string
  storeHref: string | null
  title: string
  code: string | null
  description: string
  terms: string
  url: string
  startsAt: string | null
  expiresAt: string | null
  source: string
  checkedAt: string
  category: string | null
}

type Timed = {
  startsAt?: string | null
  expiresAt: string | null
}

export function promoStatus(item: Timed, now: Date): PromoStatus {
  if (item.expiresAt && Date.parse(item.expiresAt) <= now.getTime()) return 'expired'
  if (item.startsAt && Date.parse(item.startsAt) > now.getTime()) return 'upcoming'
  return 'active'
}

export function toPromoCard(item: Promo, knownSlugs: ReadonlySet<string>): PromoCardModel {
  const slug = item.storeSlug ?? null
  return {
    id: item.id,
    store: item.store,
    storeSlug: slug || toSlug(item.store),
    storeHref: slug && knownSlugs.has(slug) ? `/stores/${slug}` : null,
    title: item.title,
    code: item.code ?? null,
    description: item.description,
    terms: item.terms,
    url: item.url,
    startsAt: item.startsAt ?? null,
    expiresAt: item.expiresAt,
    source: item.source,
    checkedAt: item.checkedAt,
    category: item.category ?? null
  }
}

function zoneOf(iso: string): string {
  return iso.match(/(Z|[+-]\d{2}:\d{2})$/)?.[0] ?? 'Z'
}

function offsetMinutes(zone: string): number {
  if (zone === 'Z') return 0
  const sign = zone[0] === '-' ? -1 : 1
  const hours = Number(zone.slice(1, 3))
  const minutes = Number(zone.slice(4, 6))
  return sign * (hours * 60 + minutes)
}

function zoneLabel(zone: string): string {
  if (zone === 'Z') return 'UTC'
  const sign = zone[0]
  const hours = Number(zone.slice(1, 3))
  const minutes = zone.slice(4, 6)
  if (hours === 0 && minutes === '00') return 'UTC'
  if (minutes === '00') return `UTC${sign}${hours}`
  return `UTC${sign}${hours}:${minutes}`
}

type WallClock = {
  month: string
  day: number
  year: number
  hour: number
  minute: string
  suffix: 'AM' | 'PM'
  zone: string
}

function wallClock(iso: string): WallClock | null {
  const zone = zoneOf(iso)
  const parsed = Date.parse(iso)
  if (Number.isNaN(parsed)) return null
  const shifted = new Date(parsed + offsetMinutes(zone) * 60_000)
  const rawHour = shifted.getUTCHours()
  return {
    month: MONTHS[shifted.getUTCMonth()],
    day: shifted.getUTCDate(),
    year: shifted.getUTCFullYear(),
    hour: rawHour % 12 || 12,
    minute: String(shifted.getUTCMinutes()).padStart(2, '0'),
    suffix: rawHour >= 12 ? 'PM' : 'AM',
    zone: zoneLabel(zone)
  }
}

/** Date, time, and the timezone written on the ISO string. Example: Mar 31, 2026, 11:59 PM UTC-5. */
export function formatPromoInstant(iso: string): string {
  const clock = wallClock(iso)
  if (!clock) return 'Invalid date'
  return `${clock.month} ${clock.day}, ${clock.year}, ${clock.hour}:${clock.minute} ${clock.suffix} ${clock.zone}`
}

/** Calendar date in the timezone written on the ISO string. */
export function formatPromoDate(iso: string): string {
  const clock = wallClock(iso)
  if (!clock) return 'Invalid date'
  return `${clock.month} ${clock.day}, ${clock.year}`
}

/** `checkedAt` is a calendar date (YYYY-MM-DD), shown as Nov 9, 2026. */
export function formatCheckedDay(isoDate: string): string {
  const [yearRaw, monthRaw, dayRaw] = isoDate.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)
  const monthName = MONTHS[month - 1]
  if (!year || !monthName || !day) return 'Invalid date'
  return `${monthName} ${day}, ${year}`
}

export function endLabel(expiresAt: string | null): string {
  if (!expiresAt) return 'No set end date'
  return `Expires ${formatPromoInstant(expiresAt)}`
}

export function checkedLabel(isoDate: string): string {
  return `Checked ${formatCheckedDay(isoDate)}`
}

function bySoonestExpiry(a: PromoCardModel, b: PromoCardModel): number {
  const aTime = a.expiresAt ? Date.parse(a.expiresAt) : Number.POSITIVE_INFINITY
  const bTime = b.expiresAt ? Date.parse(b.expiresAt) : Number.POSITIVE_INFINITY
  if (aTime !== bTime) return aTime - bTime
  return a.store.localeCompare(b.store) || a.id.localeCompare(b.id)
}

function bySoonestStart(a: PromoCardModel, b: PromoCardModel): number {
  const aTime = Date.parse(String(a.startsAt))
  const bTime = Date.parse(String(b.startsAt))
  if (aTime !== bTime) return aTime - bTime
  return a.store.localeCompare(b.store) || a.id.localeCompare(b.id)
}

function byRecentExpiry(a: PromoCardModel, b: PromoCardModel): number {
  const aTime = Date.parse(String(a.expiresAt))
  const bTime = Date.parse(String(b.expiresAt))
  if (aTime !== bTime) return bTime - aTime
  return a.store.localeCompare(b.store) || a.id.localeCompare(b.id)
}

export function groupPromos(items: readonly PromoCardModel[], now: Date) {
  const active: PromoCardModel[] = []
  const upcoming: PromoCardModel[] = []
  const expired: PromoCardModel[] = []
  for (const item of items) {
    const status = promoStatus(item, now)
    if (status === 'active') active.push(item)
    else if (status === 'upcoming') upcoming.push(item)
    else expired.push(item)
  }
  active.sort(bySoonestExpiry)
  upcoming.sort(bySoonestStart)
  expired.sort(byRecentExpiry)
  return { active, upcoming, expired }
}

export function activePromosForStore(slug: string, items: readonly Promo[], now: Date): Promo[] {
  return items.filter((item) => item.storeSlug === slug && promoStatus(item, now) === 'active')
}

export function latestPromoCheckedAt(items: readonly { checkedAt: string }[]): string | undefined {
  if (items.length === 0) return undefined
  const latest = items.map((item) => item.checkedAt).sort().at(-1) as string
  return `${latest}T12:00:00.000Z`
}

export function renderPromoEntryMarkdown(item: PromoCardModel, status: PromoStatus): string[] {
  const lines = [`### ${item.store}: ${item.title}`, '', item.description, '']
  lines.push(item.code ? `Code: ${item.code}` : 'No code required.', '')
  if (status === 'expired') {
    lines.push(`Expired ${formatPromoDate(item.expiresAt ?? '')}.`, '')
  } else {
    if (status === 'upcoming') lines.push(`Starts ${formatPromoInstant(item.startsAt ?? '')}.`, '')
    lines.push(`${endLabel(item.expiresAt)}.`, '')
  }
  lines.push(`${checkedLabel(item.checkedAt)}. Source: ${item.source}.`, '')
  lines.push(`Terms: ${item.terms}`, '')
  lines.push(`- [Official offer page](${item.url})`)
  if (item.storeHref) lines.push(`- [Store page](${absoluteUrl(item.storeHref)})`)
  lines.push('')
  return lines
}

export function renderPromosMarkdown(
  items: readonly Promo[],
  now: Date,
  knownSlugs: ReadonlySet<string> = new Set()
): string {
  const lines = [
    '# Promo codes and limited-time offers',
    '',
    `Canonical: ${absoluteUrl('/promos')}`,
    '',
    FTC_AFFILIATE_DISCLOSURE,
    ''
  ]
  if (items.length === 0) {
    lines.push('No promo codes are listed right now.', '')
    return `${lines.join('\n')}\n`
  }
  const models = items.map((item) => toPromoCard(item, knownSlugs))
  const groups = groupPromos(models, now)
  const sections: { title: string; rows: PromoCardModel[]; status: PromoStatus }[] = [
    { title: 'Active', rows: groups.active, status: 'active' },
    { title: 'Starts later', rows: groups.upcoming, status: 'upcoming' },
    { title: 'Expired', rows: groups.expired, status: 'expired' }
  ]
  for (const section of sections) {
    if (section.rows.length === 0) continue
    lines.push(`## ${section.title}`, '')
    for (const item of section.rows) lines.push(...renderPromoEntryMarkdown(item, section.status))
  }
  return `${lines.join('\n').trim()}\n`
}

export function storePromoMarkdown(slug: string, items: readonly Promo[], now: Date): string {
  const active = activePromosForStore(slug, items, now).map((item) => toPromoCard(item, new Set([slug])))
  if (active.length === 0) return ''
  const lines = ['## Promo codes', '']
  for (const item of active) lines.push(...renderPromoEntryMarkdown(item, 'active'))
  return `${lines.join('\n').trim()}\n`
}

export function withStorePromoMarkdown(
  markdown: string,
  slug: string,
  items: readonly Promo[],
  now: Date
): string {
  const extra = storePromoMarkdown(slug, items, now)
  if (!extra) return markdown
  return `${markdown.trimEnd()}\n\n${extra}`
}
