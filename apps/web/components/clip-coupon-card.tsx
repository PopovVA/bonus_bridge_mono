import React from 'react'
import { Scissors } from 'lucide-react'

export type ClipCouponCardProps = {
  logoSrc: string
  brand: string
  title: string
  blurb: string
  /** Monospace / code area — promo code or a short label (e.g. “Referral link”). */
  codeDisplay: string
  /** Copy + toast + confirm dialog (no auto navigation). */
  onCodeClick: () => void | Promise<void>
  /** Opens partner URL in a new tab immediately — no dialog. */
  onGetOfferClick: () => void | Promise<void>
  clipAriaLabel: string
  clipButtonLabel?: string
  /** Accessible name for the primary CTA (default: open partner in new tab). */
  getOfferAriaLabel?: string
}

/** Tear-off promo card shell (styles: `home.css` `.clip-coupon-card*`). */
export function ClipCouponCard({
  logoSrc,
  brand,
  title,
  blurb,
  codeDisplay,
  onCodeClick,
  onGetOfferClick,
  clipAriaLabel,
  clipButtonLabel = 'Get offer',
  getOfferAriaLabel = 'Open partner offer in a new tab'
}: ClipCouponCardProps) {
  return (
    <article className="clip-coupon-card">
      <div className="clip-coupon-card__logo-row">
        {/* eslint-disable-next-line @next/next/no-img-element -- static assets under /public */}
        <img src={logoSrc} alt="" className="clip-coupon-card__logo" decoding="async" />
      </div>
      <div className="clip-coupon-card__top">
        <p className="clip-coupon-card__brand">{brand}</p>
        <h3 className="clip-coupon-card__headline">{title}</h3>
        <p className="clip-coupon-card__blurb">{blurb}</p>
      </div>
      <div className="clip-coupon-card__tear" aria-hidden="true">
        <div className="clip-coupon-card__tear-line" />
        <span className="clip-coupon-card__scissors-wrap">
          <Scissors className="clip-coupon-card__scissors" size={18} strokeWidth={2} aria-hidden />
        </span>
      </div>
      <div className="clip-coupon-card__bottom">
        <button type="button" className="clip-coupon-card__code" onClick={() => void onCodeClick()} aria-label={clipAriaLabel}>
          {codeDisplay}
        </button>
        <button
          type="button"
          className="clip-coupon-card__btn"
          onClick={() => void onGetOfferClick()}
          aria-label={getOfferAriaLabel}
        >
          {clipButtonLabel}
        </button>
      </div>
    </article>
  )
}
