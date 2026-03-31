import type { HotCashbackOffer } from '@/lib/hot-cashback'

type Props = {
  offers: HotCashbackOffer[]
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

export function HotCashback({ offers }: Props) {
  if (offers.length === 0) return null

  return (
    <section id="hot-cashback" className="hot-cashback-section" aria-labelledby="hot-cashback-heading">
      <div className="section-head hot-cashback-head">
        <h2 id="hot-cashback-heading" className="section-title">
          Hot Cashback
        </h2>
        <p className="section-subtitle">
          Sign up below—welcome offers and eligibility are set by each partner.
        </p>
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
                <p className="hot-cashback-card__desc">{offer.description}</p>
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
