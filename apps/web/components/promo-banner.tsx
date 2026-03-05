import type { PremiumBanner } from '@bonusbridge/shared'

export function PromoBanner({ banner }: { banner: PremiumBanner | null }) {
  if (!banner) return null

  const Cta = banner.ctaHref ? (
    <a href={banner.ctaHref} className="promo-cta">
      {banner.ctaText}
    </a>
  ) : (
    <a href="#premium" className="promo-cta">
      {banner.ctaText}
    </a>
  )

  return (
    <section className="promo-section">
      <div className="promo-banner">
        <div className="promo-content">
          <h3>{banner.title}</h3>
          <p>{banner.description}</p>
          <div>
            <span className="promo-price">{banner.priceText}</span>
            {banner.priceNote && <span className="promo-note">{banner.priceNote}</span>}
          </div>
        </div>
        {Cta}
      </div>
    </section>
  )
}
