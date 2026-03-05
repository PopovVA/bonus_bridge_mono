import Link from 'next/link'

type StoreCardProps = {
  id: string
  name: string
  slug: string
  logoSvg?: string | null
  bonusLabel?: string
}

export function StoreCard({ name, slug, logoSvg, bonusLabel = 'View deals' }: StoreCardProps) {
  return (
    <Link href={`/stores/${slug}`} className="store-card">
      <div className="store-card-logo">
        {logoSvg ? (
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
      <span className="store-card-badge">{bonusLabel}</span>
    </Link>
  )
}
