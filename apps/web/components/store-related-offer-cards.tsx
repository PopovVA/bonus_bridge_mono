'use client'

import { useCallback } from 'react'
import { ClipCouponCard } from '@/components/clip-coupon-card'
import { ClipOpenStoreDialog } from '@/components/clip-open-store-dialog'
import { useClipPartnerOfferFlow } from '@/components/use-clip-partner-offer-flow'
import { getCuratedLinkCardCopyForExploreMore } from '@/lib/explore-more-link-card-copy'
import { sortOffersPromoCodesFirst } from '@/lib/offer-sort'
import { megaMenuStoreImageSrc } from '@/lib/site-data'

export type StoreRelatedOfferCard = {
  id: string
  title: string
  previewText: string
  couponCode: string | null
  serviceSlug: string
  serviceName: string
  logoSrc: string | null
  referralUrl: string
}

function thumbSrc(logoSrc: string | null) {
  return megaMenuStoreImageSrc({ logoSrc })
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

type Props = {
  offers: StoreRelatedOfferCard[]
  labelledBy: string
}

/** Clip-style cards when a code exists; hot-cashback–style cards for link-only offers. Code: copy + dialog; Get offer: open URL immediately. */
export function StoreRelatedOfferCards({ offers, labelledBy }: Props) {
  const { toast, toastId, pending, runClipFlow, closeDialog, confirmOpenInNewTab } = useClipPartnerOfferFlow()

  const handleCodeClick = useCallback(
    (o: StoreRelatedOfferCard) => {
      const copyValue = o.couponCode?.trim() ? o.couponCode.trim() : o.referralUrl
      void runClipFlow(copyValue, o.referralUrl)
    },
    [runClipFlow]
  )

  const handleGetOfferClick = useCallback((o: StoreRelatedOfferCard) => {
    window.open(o.referralUrl, '_blank', 'noopener,noreferrer')
  }, [])

  if (offers.length === 0) return null

  const sorted = sortOffersPromoCodesFirst(offers)

  return (
    <>
      <ul className="store-related-offers-card-grid" aria-labelledby={labelledBy}>
        {sorted.map((o) => {
          const logo = thumbSrc(o.logoSrc)
          const hasCode = Boolean(o.couponCode?.trim())
          if (hasCode) {
            const codeDisplay = o.couponCode!.trim()
            const clipAriaLabel = `Copy code ${codeDisplay}`
            return (
              <li key={o.id} className="store-related-offers-card-grid__cell">
                <ClipCouponCard
                  logoSrc={logo}
                  brand={o.serviceName.toUpperCase()}
                  title={o.title}
                  blurb={o.previewText}
                  codeDisplay={codeDisplay}
                  onCodeClick={() => handleCodeClick(o)}
                  onGetOfferClick={() => handleGetOfferClick(o)}
                  clipAriaLabel={clipAriaLabel}
                />
              </li>
            )
          }
          const curated = getCuratedLinkCardCopyForExploreMore(o.serviceSlug)
          const badgeText = curated?.badgeText ?? 'Offer'
          const descText = curated?.description ?? null
          const ctaText = curated?.ctaText ?? 'Open offer'
          const offerHref = curated?.href ?? o.referralUrl
          const logoSrc = curated?.logoSrc ?? logo

          return (
            <li key={o.id} className="store-related-offers-card-grid__cell">
              <article className="hot-cashback-card store-related-discovery-offer-card">
                <div className="hot-cashback-card__badge">
                  <CashbackBadgeIcon />
                  <span className="hot-cashback-card__badge-text">{badgeText}</span>
                </div>
                <div className="hot-cashback-card__body">
                  <div className="hot-cashback-card__logo-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element -- same pattern as HotCashback */}
                    <img
                      src={logoSrc}
                      alt=""
                      width={160}
                      height={40}
                      className="hot-cashback-card__logo"
                    />
                  </div>
                  <div className="hot-cashback-card__desc-wrap">
                    {descText ? (
                      <p className="hot-cashback-card__desc">{descText}</p>
                    ) : (
                      <p className="hot-cashback-card__desc">
                        <strong className="store-related-discovery-offer-card__title">{o.title}</strong>
                        {o.previewText?.trim() ? <> {o.previewText.trim()}</> : null}
                      </p>
                    )}
                  </div>
                  <a
                    href={offerHref}
                    className="hot-cashback-card__cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ctaText}
                  </a>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
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
