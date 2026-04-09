'use client'

import { TrackedLink } from '@/components/tracked-link'

type StoreCardProps = {
  id: string
  name: string
  slug: string
  logoSvg?: string | null
  logoSrc?: string | null
  description?: string | null
  bonusLabel?: string
}

const STORE_CARD_FALLBACK_BLURB = 'Promo codes and offers on the store page.'

export function StoreCard({
  name,
  slug,
  logoSvg,
  logoSrc,
  description,
  bonusLabel = 'View deals'
}: StoreCardProps) {
  const blurb = description?.trim() || STORE_CARD_FALLBACK_BLURB

  return (
    <TrackedLink
      href={`/stores/${slug}`}
      className="store-card"
      event="store_card_click"
      eventParams={{ store_slug: slug }}
    >
      <div className="store-card-logo">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- caller passes /public paths
          <img src={logoSrc} alt="" width={64} height={64} className="store-card-logo-img" decoding="async" />
        ) : logoSvg ? (
          <span
            style={{
              width: 64,
              height: 64,
              display: 'block',
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(logoSvg)}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            aria-hidden
          />
        ) : (
          <div className="store-card-logo-placeholder">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="store-card-name">{name}</h3>
      <p className="store-card-desc">{blurb}</p>
      <span className="store-card-badge">{bonusLabel}</span>
    </TrackedLink>
  )
}
