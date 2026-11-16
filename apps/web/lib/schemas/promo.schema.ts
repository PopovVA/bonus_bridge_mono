import { z } from 'zod'

/** ISO datetime that always carries Z or a numeric offset, so expiry is not "local time somewhere". */
export const PromoDateTimeSchema = z.iso.datetime({ offset: true })

export const PromoDateSchema = z.iso.date()

const SlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

const HttpUrlSchema = z
  .string()
  .trim()
  .url()
  .max(500)
  .refine((value) => {
    const protocol = new URL(value).protocol
    return protocol === 'https:' || protocol === 'http:'
  }, 'Official URL must use http or https')

export const PromoSchema = z
  .object({
    id: SlugSchema,
    store: z.string().trim().min(2).max(120),
    storeSlug: SlugSchema.nullish(),
    title: z.string().trim().min(2).max(180),
    code: z.string().trim().min(1).max(64).nullish(),
    description: z.string().trim().min(2).max(500),
    terms: z.string().trim().min(2).max(280),
    url: HttpUrlSchema,
    startsAt: PromoDateTimeSchema.nullish(),
    expiresAt: PromoDateTimeSchema.nullable(),
    source: z.string().trim().min(2).max(120),
    checkedAt: PromoDateSchema,
    category: z.string().trim().min(2).max(80).nullish()
  })
  .strict()

export const PromosFileSchema = z.array(PromoSchema).superRefine((items, ctx) => {
  const seen = new Set<string>()
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'id'],
        message: `Duplicate id "${item.id}"`
      })
    }
    seen.add(item.id)
    if (item.startsAt && item.expiresAt && Date.parse(item.expiresAt) <= Date.parse(item.startsAt)) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'expiresAt'],
        message: 'expiresAt must be later than startsAt'
      })
    }
  })
})

export type Promo = z.infer<typeof PromoSchema>

export function formatPromoIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(file)'
      return `${path}: ${issue.message}`
    })
    .join('; ')
}

/** Throws when the file is not a valid promo list. Imported at build time so CI fails closed. */
export function parsePromos(input: unknown): Promo[] {
  const parsed = PromosFileSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(`Invalid promos file: ${formatPromoIssues(parsed.error)}`)
  }
  return parsed.data
}
