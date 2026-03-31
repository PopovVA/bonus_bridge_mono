import type { MonthlyTopOffer } from '@/lib/schemas'

type Props = {
  offers: MonthlyTopOffer[]
}

function logoWrapClass(slug: string): string {
  const base = 'monthly-offer-card__logo-wrap'
  if (slug === 'robinhood') {
    return `${base} ${base}--robinhood`
  }
  return base
}

function mediaShellClass(slug: string): string {
  const base = 'monthly-offer-card__media'
  if (slug === 'public') return `${base} ${base}--public`
  if (slug === 'robinhood') return `${base} ${base}--robinhood`
  return base
}

function mediaImgClass(slug: string): string {
  const base = 'monthly-offer-card__media-img'
  if (slug === 'public') {
    return `${base} ${base}--public-contain`
  }
  if (slug === 'robinhood') {
    return `${base} ${base}--robinhood-contain`
  }
  return base
}

/** Price-tag outline in the same stroke spirit as site chrome (e.g. lucide icons in the header). */
function OfferDealBadgeIcon() {
  return (
    <svg
      className="monthly-offer-card__badge-icon"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function MonthlyTopOffers({ offers }: Props) {
  if (offers.length === 0) return null

  return (
    <section id="top-offers" className="monthly-offers-section" aria-labelledby="monthly-offers-heading">
      <div className="section-head monthly-offers-head">
        <h2 id="monthly-offers-heading" className="section-title">
          Top offers this month
        </h2>
        <p className="section-subtitle">Hand-picked invites — tap a card to open the partner offer.</p>
      </div>
      <div className="monthly-offers-grid">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className={
              offer.badgeText
                ? 'monthly-offer-card monthly-offer-card--has-badge'
                : 'monthly-offer-card'
            }
          >
            {offer.badgeText ? (
              <div className="monthly-offer-card__badge">
                <OfferDealBadgeIcon />
                <span className="monthly-offer-card__badge-text">{offer.badgeText}</span>
              </div>
            ) : null}
            <div className="monthly-offer-card__body">
              <div className="monthly-offer-card__left">
                <div className={logoWrapClass(offer.slug)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG from /public */}
                  <img
                    src={offer.logoSrc}
                    alt=""
                    width={120}
                    height={48}
                    className="monthly-offer-card__logo"
                  />
                </div>
                <div className="monthly-offer-card__desc-wrap">
                  <p className="monthly-offer-card__desc">{offer.description}</p>
                </div>
                <a
                  href={offer.href}
                  className="monthly-offer-card__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {offer.ctaText}
                </a>
              </div>
              <div className={mediaShellClass(offer.slug)}>
                {offer.imageSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={offer.imageSrc}
                    alt={`${offer.brandName} — offer highlights`}
                    width={280}
                    height={360}
                    className={mediaImgClass(offer.slug)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : offer.slug === 'robinhood' ? (
                  <div className="monthly-offer-card__robinhood-visual" aria-hidden="true" />
                ) : (
                  <div className="monthly-offer-card__skeleton" aria-hidden="true">
                    <span className="monthly-offer-card__skeleton-shimmer" />
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
