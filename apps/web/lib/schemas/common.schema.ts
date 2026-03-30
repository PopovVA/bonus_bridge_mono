import { z } from 'zod'

export const UuidSchema = z.string().uuid()
export const SlugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export const UrlSchema = z.string().url()

export const OfferStatusSchema = z.enum(['draft', 'active', 'expired'])
export const OfferSortSchema = z.enum(['new', 'bonus'])
