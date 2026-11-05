import type { ListingFacts as ListingFactsModel } from '@/lib/schemas/listing-facts.schema'

type Props = {
  facts: ListingFactsModel
}

/** Visible region, conditions, and listing date. Does not assert a verified bonus. */
export function ListingFacts({ facts }: Props) {
  return (
    <dl className="listing-facts">
      <div>
        <dt>{facts.regionLabel}</dt>
        <dd>{facts.region}</dd>
      </div>
      <div>
        <dt>{facts.conditionsLabel}</dt>
        <dd>{facts.conditions}</dd>
      </div>
      {facts.promotionNote ? (
        <div>
          <dt>Public referral</dt>
          <dd>{facts.promotionNote}</dd>
        </div>
      ) : null}
      {facts.listingUpdatedLabel ? (
        <div>
          <dt>Listing updated</dt>
          <dd>
            {facts.listingUpdatedLabel}. {facts.listingUpdatedNote}
          </dd>
        </div>
      ) : null}
    </dl>
  )
}
