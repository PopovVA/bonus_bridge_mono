'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { trackPromoEvent, type PromoTrackStatus } from '@/lib/gtag-track'
import {
  checkedLabel,
  endLabel,
  formatPromoDate,
  formatPromoInstant,
  groupPromos,
  type PromoCardModel,
  type PromoStatus
} from '@/lib/promo-entries'

type CopyHandler = (id: string, code: string, storeSlug: string, promoStatus: PromoTrackStatus) => void

type CardProps = {
  item: PromoCardModel
  status: PromoStatus
  copied: boolean
  failed: boolean
  place: string
  onCopy: CopyHandler
}

export function PromoCard({ item, status, copied, failed, place, onCopy }: CardProps) {
  const expired = status === 'expired'
  const code = item.code
  return (
    <article className={expired ? 'promo-card promo-card--expired' : 'promo-card'} data-promo-status={status}>
      <header className="promo-card__header">
        {item.storeHref ? (
          <Link href={item.storeHref} className="promo-card__store">
            {item.store}
          </Link>
        ) : (
          <span className="promo-card__store">{item.store}</span>
        )}
        {item.category ? <span className="promo-card__category">{item.category}</span> : null}
      </header>
      <h3 className="promo-card__title">{item.title}</h3>
      <p className="promo-card__description">{item.description}</p>
      <p className="promo-card__terms">Terms: {item.terms}</p>
      <div className="promo-card__code-row">
        <span className="promo-card__code">{code ?? 'No code required'}</span>
        {status === 'active' && code ? (
          <button
            type="button"
            className="btn btn--ghost promo-card__copy"
            onClick={() => onCopy(item.id, code, item.storeSlug, 'active')}
          >
            {copied ? 'Copied' : failed ? 'Could not copy' : 'Copy code'}
          </button>
        ) : null}
      </div>
      {expired ? (
        <p className="promo-card__badge">Expired {formatPromoDate(item.expiresAt ?? '')}</p>
      ) : (
        <p className="promo-card__when">
          {status === 'upcoming' ? <span>Starts {formatPromoInstant(item.startsAt ?? '')}. </span> : null}
          {endLabel(item.expiresAt)}
        </p>
      )}
      <p className="promo-card__checked">
        {checkedLabel(item.checkedAt)}. Source: {item.source}.
      </p>
      {expired ? null : (
        <a
          className="promo-card__official"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackPromoEvent('promo_click', {
              promoId: item.id,
              storeSlug: item.storeSlug,
              place,
              promoStatus: 'active'
            })
          }
        >
          Official offer page
        </a>
      )}
    </article>
  )
}

type GroupProps = {
  title: string
  items: PromoCardModel[]
  status: PromoStatus
  copiedId: string | null
  failedId: string | null
  place: string
  onCopy: CopyHandler
}

function PromoGroup({ title, items, status, copiedId, failedId, place, onCopy }: GroupProps) {
  if (items.length === 0) return null
  const headingId = `promo-group-${status}`
  return (
    <section className="promo-group" aria-labelledby={headingId}>
      <h2 id={headingId} className="promo-group__title">
        {title}
      </h2>
      <ul className="promo-list">
        {items.map((item) => (
          <li key={item.id}>
            <PromoCard
              item={item}
              status={status}
              copied={copiedId === item.id}
              failed={failedId === item.id}
              place={place}
              onCopy={onCopy}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

type Props = {
  items: PromoCardModel[]
  nowIso: string
  mode: 'directory' | 'store'
}

export function PromoBoard({ items, nowIso, mode }: Props) {
  const [nowMs, setNowMs] = useState(() => Date.parse(nowIso))
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [failedId, setFailedId] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setNowMs(Date.now())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const place = mode === 'store' ? 'store_page' : 'promos_page'

  async function onCopy(id: string, code: string, storeSlug: string, promoStatus: PromoTrackStatus) {
    try {
      const write = navigator.clipboard?.writeText
      if (!write) throw new Error('Clipboard is unavailable')
      await write.call(navigator.clipboard, code)
      trackPromoEvent('promo_copy', { promoId: id, storeSlug, place, promoStatus })
      setCopiedId(id)
      setFailedId(null)
    } catch {
      setCopiedId(null)
      setFailedId(id)
    }
  }

  const grouped = groupPromos(items, new Date(nowMs))

  if (mode === 'store') {
    if (grouped.active.length === 0) return null
    return (
      <section className="store-promos" aria-labelledby="store-promos-heading">
        <h2 id="store-promos-heading" className="section-title">
          Promo codes
        </h2>
        <p className="store-promos__intro">
          Limited-time codes checked for this store. Confirm the offer on the official page before you use a code.
        </p>
        <ul className="promo-list">
          {grouped.active.map((item) => (
            <li key={item.id}>
              <PromoCard
                item={item}
                status="active"
                copied={copiedId === item.id}
                failed={failedId === item.id}
                place={place}
                onCopy={onCopy}
              />
            </li>
          ))}
        </ul>
        <p className="store-promos__more">
          <Link href="/promos">All promo codes</Link>
        </p>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="promo-groups">
      <PromoGroup
        title="Active"
        items={grouped.active}
        status="active"
        copiedId={copiedId}
        failedId={failedId}
        place={place}
        onCopy={onCopy}
      />
      <PromoGroup
        title="Starts later"
        items={grouped.upcoming}
        status="upcoming"
        copiedId={copiedId}
        failedId={failedId}
        place={place}
        onCopy={onCopy}
      />
      <PromoGroup
        title="Expired"
        items={grouped.expired}
        status="expired"
        copiedId={copiedId}
        failedId={failedId}
        place={place}
        onCopy={onCopy}
      />
    </div>
  )
}
