/** Promo codes first, then link-only offers; stable order within each group. */
export function sortOffersPromoCodesFirst<T extends { couponCode: string | null }>(offers: T[]): T[] {
  return [...offers].sort((a, b) => {
    const ac = Boolean(a.couponCode?.trim())
    const bc = Boolean(b.couponCode?.trim())
    if (ac !== bc) return ac ? -1 : 1
    return 0
  })
}
