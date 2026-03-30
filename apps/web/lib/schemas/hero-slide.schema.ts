import { z } from 'zod'
import { UuidSchema } from './common.schema'

const heroSlideMeta = {
  id: UuidSchema,
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}

export const HeroSlideImageSchema = z.object({
  kind: z.literal('image'),
  ...heroSlideMeta,
  imageUrl: z.string().url()
})

export const HeroChimeStepSchema = z.object({
  title: z.string().min(1).max(300),
  hint: z.string().max(500).optional()
})

export const HeroSlideChimeSchema = z.object({
  kind: z.literal('chime'),
  ...heroSlideMeta,
  /** Small label above the headline (e.g. “Limited-time offer”). */
  eyebrow: z.string().max(100).optional(),
  headline: z.string().min(1).max(200),
  /** Short conversion line under the headline. */
  promoHighlight: z.string().max(280).optional(),
  subtext: z.string().min(1).max(2000),
  termsLabel: z.string().max(80).optional(),
  termsUrl: z.string().url().optional(),
  /** Primary CTA — single button linking to the offer (no URL field in UI). */
  referralUrl: z.string().url(),
  ctaText: z.string().min(1).max(80),
  leftImageUrl: z.string().url().optional(),
  rightImageUrl: z.string().url().optional(),
  stepsTitle: z.string().max(200).optional(),
  steps: z.array(HeroChimeStepSchema).max(6).optional()
})

export const HeroSlideCoinbaseSchema = z.object({
  kind: z.literal('coinbase'),
  ...heroSlideMeta,
  eyebrow: z.string().max(100).optional(),
  headline: z.string().min(1).max(200),
  promoHighlight: z.string().max(280).optional(),
  subtext: z.string().min(1).max(2000),
  termsLabel: z.string().max(80).optional(),
  termsUrl: z.string().url().optional(),
  referralUrl: z.string().url(),
  ctaText: z.string().min(1).max(80),
  stepsTitle: z.string().max(200).optional(),
  steps: z.array(HeroChimeStepSchema).max(6).optional()
})

export const HeroSlidePaypalSchema = z.object({
  kind: z.literal('paypal'),
  ...heroSlideMeta,
  eyebrow: z.string().max(100).optional(),
  headline: z.string().min(1).max(200),
  promoHighlight: z.string().max(280).optional(),
  subtext: z.string().min(1).max(2000),
  termsLabel: z.string().max(80).optional(),
  termsUrl: z.string().url().optional(),
  referralUrl: z.string().url(),
  ctaText: z.string().min(1).max(80),
  stepsTitle: z.string().max(200).optional(),
  steps: z.array(HeroChimeStepSchema).max(6).optional()
})

export const HeroSlideUberSchema = z.object({
  kind: z.literal('uber'),
  ...heroSlideMeta,
  eyebrow: z.string().max(100).optional(),
  headline: z.string().min(1).max(200),
  promoHighlight: z.string().max(280).optional(),
  subtext: z.string().min(1).max(2000),
  termsLabel: z.string().max(80).optional(),
  termsUrl: z.string().url().optional(),
  referralUrl: z.string().url(),
  ctaText: z.string().min(1).max(80),
  stepsTitle: z.string().max(200).optional(),
  steps: z.array(HeroChimeStepSchema).max(6).optional()
})

export const HeroSlideUbereatsSchema = z.object({
  kind: z.literal('ubereats'),
  ...heroSlideMeta,
  eyebrow: z.string().max(100).optional(),
  headline: z.string().min(1).max(200),
  promoHighlight: z.string().max(280).optional(),
  subtext: z.string().min(1).max(2000),
  termsLabel: z.string().max(80).optional(),
  termsUrl: z.string().url().optional(),
  referralUrl: z.string().url(),
  ctaText: z.string().min(1).max(80),
  stepsTitle: z.string().max(200).optional(),
  steps: z.array(HeroChimeStepSchema).max(6).optional()
})

export const HeroSlideSchema = z.discriminatedUnion('kind', [
  HeroSlideImageSchema,
  HeroSlideChimeSchema,
  HeroSlideCoinbaseSchema,
  HeroSlidePaypalSchema,
  HeroSlideUberSchema,
  HeroSlideUbereatsSchema
])

export type HeroSlideImage = z.infer<typeof HeroSlideImageSchema>
export type HeroSlideChime = z.infer<typeof HeroSlideChimeSchema>
export type HeroSlideCoinbase = z.infer<typeof HeroSlideCoinbaseSchema>
export type HeroSlidePaypal = z.infer<typeof HeroSlidePaypalSchema>
export type HeroSlideUber = z.infer<typeof HeroSlideUberSchema>
export type HeroSlideUbereats = z.infer<typeof HeroSlideUbereatsSchema>
export type HeroSlide = z.infer<typeof HeroSlideSchema>
export type HeroChimeStep = z.infer<typeof HeroChimeStepSchema>
