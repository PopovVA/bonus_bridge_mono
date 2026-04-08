import type { HotCashbackOffer } from '@/lib/hot-cashback'

type Props = {
  offers: HotCashbackOffer[]
  heading?: string
  subtitle?: string
  sectionId?: string
}

function CashbackBadgeIcon() {
  return (
    <svg
      className="hot-cashback-card__badge-icon"
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

export function HotCashback({
  offers,
  heading = 'Hot Cashback',
  subtitle = 'Sign up below—welcome offers and eligibility are set by each partner.',
  sectionId = 'hot-cashback'
}: Props) {
  if (offers.length === 0) return null

  return (
    <section id={sectionId} className="hot-cashback-section" aria-labelledby={`${sectionId}-heading`}>
      <div className="section-head hot-cashback-head">
        <h2 id={`${sectionId}-heading`} className="section-title">
          {heading}
        </h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <div className="hot-cashback-grid">
        {offers.map((offer) => (
          <article key={offer.id} className="hot-cashback-card">
            <div className="hot-cashback-card__badge">
              <CashbackBadgeIcon />
              <span className="hot-cashback-card__badge-text">{offer.badgeText}</span>
            </div>
            <div className="hot-cashback-card__body">
              <div className="hot-cashback-card__logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG wordmarks in /public */}
                <img
                  src={offer.logoSrc}
                  alt=""
                  width={160}
                  height={40}
                  className="hot-cashback-card__logo"
                />
              </div>
              <div className="hot-cashback-card__desc-wrap">
                <div className="hot-cashback-card__text-stack">
                  <p className="clip-coupon-card__brand">{offer.brandName.toUpperCase()}</p>
                  <h3 className="clip-coupon-card__headline">{offer.headline}</h3>
                  <p className="clip-coupon-card__blurb">{offer.description}</p>
                </div>
              </div>
              <a
                href={offer.href}
                className="hot-cashback-card__cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                {offer.ctaText}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
