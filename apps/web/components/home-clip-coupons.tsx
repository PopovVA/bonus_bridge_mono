'use client'

import { useCallback, useId, useState } from 'react'
import { Scissors } from 'lucide-react'
import type { HomeClipCoupon } from '@/lib/home-clip-coupons'

type Props = {
  coupons: HomeClipCoupon[]
}

export function HomeClipCoupons({ coupons }: Props) {
  const [toast, setToast] = useState<string | null>(null)
  const toastId = useId()

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const handleClip = useCallback(
    async (c: HomeClipCoupon) => {
      try {
        await navigator.clipboard.writeText(c.code)
      } catch {
        showToast('Could not copy — select the code manually.')
        window.open(c.openUrl, '_blank', 'noopener,noreferrer')
        return
      }
      showToast('Copied to clipboard — opening offer in a new tab.')
      window.open(c.openUrl, '_blank', 'noopener,noreferrer')
    },
    [showToast]
  )

  if (coupons.length === 0) return null

  return (
    <>
      <section id="coupons" className="clip-coupons-section" aria-labelledby="clip-coupons-heading">
        <div className="section-head clip-coupons-head">
          <h2 id="clip-coupons-heading" className="section-title">
            Codes worth clipping
          </h2>
          <p className="section-subtitle">
            Snip along the line, copy the code, and we open the partner offer for you.
          </p>
        </div>
        <div className="clip-coupons-grid">
          {coupons.map((c) => (
            <article key={c.id} className="clip-coupon-card">
              <div className="clip-coupon-card__logo-row">
                {/* eslint-disable-next-line @next/next/no-img-element -- static PNG in /public/brands */}
                <img
                  src={c.logoSrc}
                  alt=""
                  width={140}
                  height={40}
                  className="clip-coupon-card__logo"
                />
              </div>
              <div className="clip-coupon-card__top">
                <p className="clip-coupon-card__brand">{c.brand}</p>
                <h3 className="clip-coupon-card__headline">{c.title}</h3>
                <p className="clip-coupon-card__blurb">{c.blurb}</p>
              </div>
              <div className="clip-coupon-card__tear" aria-hidden="true">
                <div className="clip-coupon-card__tear-line" />
                <span className="clip-coupon-card__scissors-wrap">
                  <Scissors className="clip-coupon-card__scissors" size={18} strokeWidth={2} aria-hidden />
                </span>
              </div>
              <div className="clip-coupon-card__bottom">
                <button
                  type="button"
                  className="clip-coupon-card__code"
                  onClick={() => handleClip(c)}
                  aria-label={`Copy code ${c.code} and open offer`}
                >
                  {c.code}
                </button>
                <button
                  type="button"
                  className="clip-coupon-card__btn"
                  onClick={() => handleClip(c)}
                >
                  Copy code & open offer
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div
        id={toastId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`clip-coupons-toast${toast ? ' clip-coupons-toast--visible' : ''}`}
      >
        {toast ?? ''}
      </div>
    </>
  )
}
