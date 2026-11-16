import rawPromos from '../content/promos.json'
import { parsePromos, type Promo } from '@/lib/schemas/promo.schema'

/**
 * Live promo file. Parsing runs when this module loads, so `next build` and unit tests
 * fail if a bot commit breaks the shape. Edit `content/promos.json` only.
 */
export const promos: Promo[] = parsePromos(rawPromos)
