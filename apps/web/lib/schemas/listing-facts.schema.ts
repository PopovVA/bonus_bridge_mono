import { z } from 'zod'

/** How BonusBridge presents a store listing. This is not the provider's eligibility decision. */
export const ListingReviewStateSchema = z.enum(['unverified', 'not_publicly_promoted'])

export const ListingFactsSchema = z.object({
  reviewState: ListingReviewStateSchema,
  regionLabel: z.string().min(1),
  region: z.string().min(1),
  conditionsLabel: z.string().min(1),
  conditions: z.string().min(1),
  listingUpdatedLabel: z.string().nullable(),
  listingUpdatedNote: z.string().min(1),
  promotionNote: z.string().nullable()
})

export type ListingReviewState = z.infer<typeof ListingReviewStateSchema>
export type ListingFacts = z.infer<typeof ListingFactsSchema>
