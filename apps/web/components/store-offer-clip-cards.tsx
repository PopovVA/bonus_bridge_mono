'use client'

import { useCallback } from 'react'
import type { Offer } from '@/lib/schemas'
import { ClipCouponCard } from '@/components/clip-coupon-card'
import { ClipOpenStoreDialog } from '@/components/clip-open-store-dialog'
import { useClipPartnerOfferFlow } from '@/components/use-clip-partner-offer-flow'

type Props = {
  storeName: string
  storeLogoSrc: string
  offers: Offer[]
}

const REFERRAL_PLACEHOLDER = 'Referral link'

/** Same as home clip grid: code → copy + dialog; Get offer → open partner URL immediately. */
export function StoreOfferClipCards({ storeName, storeLogoSrc, offers }: Props) {
  const { toast, toastId, pending, runClipFlow, closeDialog, confirmOpenInNewTab } = useClipPartnerOfferFlow()

  const handleCodeClick = useCallback(
    (offer: Offer) => {
      const copyValue = offer.couponCode?.trim() ? offer.couponCode.trim() : offer.referralUrl
      void runClipFlow(copyValue, offer.referralUrl)
    },
    [runClipFlow]
  )

  const handleGetOfferClick = useCallback((offer: Offer) => {
    window.open(offer.referralUrl, '_blank', 'noopener,noreferrer')
  }, [])

  if (offers.length === 0) return null

  return (
    <>
      <div className="clip-coupons-grid" aria-label={`${storeName} offers`}>
        {offers.map((offer) => {
          const codeDisplay = offer.couponCode?.trim() ? offer.couponCode.trim() : REFERRAL_PLACEHOLDER
          const clipAriaLabel = offer.couponCode?.trim()
            ? `Copy code ${offer.couponCode.trim()}`
            : 'Copy referral link'
          return (
            <ClipCouponCard
              key={offer.id}
              logoSrc={storeLogoSrc}
              brand={storeName.toUpperCase()}
              title={offer.title}
              blurb={offer.previewText}
              codeDisplay={codeDisplay}
              onCodeClick={() => handleCodeClick(offer)}
              onGetOfferClick={() => handleGetOfferClick(offer)}
              clipAriaLabel={clipAriaLabel}
            />
          )
        })}
      </div>
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
