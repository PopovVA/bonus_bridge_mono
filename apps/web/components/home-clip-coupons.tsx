'use client'

import { useCallback } from 'react'
import { ClipCouponCard } from '@/components/clip-coupon-card'
import { ClipOpenStoreDialog } from '@/components/clip-open-store-dialog'
import { useClipPartnerOfferFlow } from '@/components/use-clip-partner-offer-flow'
import type { HomeClipCoupon } from '@/lib/home-clip-coupons'

type Props = {
  coupons: HomeClipCoupon[]
}

export function HomeClipCoupons({ coupons }: Props) {
  const { toast, toastId, pending, runClipFlow, closeDialog, confirmOpenInNewTab } = useClipPartnerOfferFlow()

  const handleCodeClick = useCallback(
    (c: HomeClipCoupon) => {
      void runClipFlow(c.code, c.openUrl)
    },
    [runClipFlow]
  )

  const handleGetOfferClick = useCallback((c: HomeClipCoupon) => {
    window.open(c.openUrl, '_blank', 'noopener,noreferrer')
  }, [])

  if (coupons.length === 0) return null

  return (
    <>
      <section id="coupons" className="clip-coupons-section" aria-labelledby="clip-coupons-heading">
        <div className="section-head clip-coupons-head">
          <h2 id="clip-coupons-heading" className="section-title">
            Codes worth clipping
          </h2>
          <p className="section-subtitle">
            Tap the code to copy and confirm opening the partner site, or use Get offer to open it right away.
          </p>
        </div>
        <div className="clip-coupons-grid">
          {coupons.map((c) => (
            <ClipCouponCard
              key={c.id}
              logoSrc={c.logoSrc}
              brand={c.brand}
              title={c.title}
              blurb={c.blurb}
              codeDisplay={c.code}
              onCodeClick={() => handleCodeClick(c)}
              onGetOfferClick={() => handleGetOfferClick(c)}
              clipAriaLabel={`Copy code ${c.code}`}
            />
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

      <ClipOpenStoreDialog
        isOpen={pending !== null}
        copySucceeded={pending?.copySucceeded ?? false}
        onClose={closeDialog}
        onConfirmOpen={confirmOpenInNewTab}
      />
    </>
  )
}
