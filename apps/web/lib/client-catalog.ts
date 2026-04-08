import type { ClientCatalogCategoryBrief, ClientCatalogPayload } from '@/lib/site-data'
import { sortOffersPromoCodesFirst } from '@/lib/offer-sort'

export type StoreRelatedSection = {
  categorySlug: string
  categoryName: string
  /** Active offers from other stores in this category block. */
  otherStoreOffers: Array<{
    id: string
    title: string
    previewText: string
    couponCode: string | null
    serviceSlug: string
    serviceName: string
    logoSrc: string | null
    referralUrl: string
  }>
}

const MAX_OTHER_OFFERS = 18

function collectOffers(stores: ClientCatalogCategoryBrief['stores']): StoreRelatedSection['otherStoreOffers'] {
  const flat = stores.flatMap((s) =>
    s.offers.map((o) => ({
      id: o.id,
      title: o.title,
      previewText: o.previewText,
      couponCode: o.couponCode,
      serviceSlug: s.slug,
      serviceName: s.name,
      logoSrc: s.logoSrc,
      referralUrl: o.referralUrl
    }))
  )
  return sortOffersPromoCodesFirst(flat).slice(0, MAX_OTHER_OFFERS)
}

/** One Explore-more card: offers from other stores in this category (current store excluded when present). */
function sectionFromCategory(
  cat: ClientCatalogCategoryBrief,
  currentStoreSlug: string
): StoreRelatedSection | null {
  const selfHere = cat.stores.some((s) => s.slug === currentStoreSlug)
  const storesForOffers = selfHere
    ? cat.stores.filter((s) => s.slug !== currentStoreSlug)
    : cat.stores
  const otherStoreOffers = collectOffers(storesForOffers)

  if (otherStoreOffers.length === 0) return null

  return {
    categorySlug: cat.slug,
    categoryName: cat.name,
    otherStoreOffers
  }
}

/**
 * Explore more: up to **3** blocks — primary category (same as store’s main category), then **two** other
 * categories from the catalog (stable slug order). Only categories with at least one active offer from
 * another store are included. In the primary block, the current store is excluded; in the other two, all
 * peer offers in that category are listed (discovery).
 */
export function getStoreRelatedSections(
  catalog: ClientCatalogPayload,
  currentStoreSlug: string,
  primaryCategorySlug: string | null
): StoreRelatedSection[] {
  if (!catalog.categories.length) return []

  const bySlug = new Map(catalog.categories.map((c) => [c.slug, c]))
  const appearsIn = catalog.categories.filter((c) => c.stores.some((s) => s.slug === currentStoreSlug))
  if (appearsIn.length === 0) return []

  const primary =
    primaryCategorySlug && appearsIn.some((c) => c.slug === primaryCategorySlug)
      ? primaryCategorySlug
      : appearsIn[0]!.slug

  const allSlugsInOrder = catalog.categories.map((c) => c.slug)
  const rest = allSlugsInOrder.filter((s) => s !== primary)
  const visitSlugs = [primary, ...rest.slice(0, 2)]

  const out: StoreRelatedSection[] = []
  for (const slug of visitSlugs) {
    const sec = sectionFromCategory(bySlug.get(slug)!, currentStoreSlug)
    if (sec) out.push(sec)
  }
  return out
}
