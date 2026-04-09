'use client'

import { TrackedLink } from '@/components/tracked-link'
import { getStoreRelatedSections } from '@/lib/client-catalog'
import { useClientCatalog } from '@/components/client-catalog-provider'
import { StoreRelatedOfferCards } from '@/components/store-related-offer-cards'

type Props = {
  storeSlug: string
  /** Canonical category from `site-data` (`store.categoryId` → slug); drives “same category first”. */
  primaryCategorySlug: string | null
}

export function StoreRelatedPanel({ storeSlug, primaryCategorySlug }: Props) {
  const catalog = useClientCatalog()
  if (!catalog?.categories?.length) return null
  const sections = getStoreRelatedSections(catalog, storeSlug, primaryCategorySlug)
  if (sections.length === 0) return null

  return (
    <section className="store-related-panel" aria-label="Related categories and promo offers">
      <h2 className="section-title store-related-panel-title">Explore more</h2>
      <div className="store-related-panel-grid">
        {sections.map((sec) => (
          <article key={sec.categorySlug} className="store-related-card app-surface-card">
            <h3 className="store-related-card-heading">
              <TrackedLink
                href={`/categories/${sec.categorySlug}`}
                event="store_related_category"
                eventParams={{ category_slug: sec.categorySlug }}
              >
                {sec.categoryName}
              </TrackedLink>
            </h3>
            <div className="store-related-card-body">
              <p className="store-related-label" id={`sr-offers-${sec.categorySlug}`}>
                Promo codes and offers from other stores
              </p>
              <StoreRelatedOfferCards
                offers={sec.otherStoreOffers}
                labelledBy={`sr-offers-${sec.categorySlug}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
