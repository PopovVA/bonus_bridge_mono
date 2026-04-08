import type { ClientCatalogPayload } from '@/lib/site-data'

export type StoreSearchRow = { slug: string; name: string }

/** One row per store slug (deduped across categories), sorted by display name. */
export function buildStoreSearchIndex(catalog: ClientCatalogPayload): StoreSearchRow[] {
  const map = new Map<string, StoreSearchRow>()
  for (const cat of catalog.categories) {
    for (const s of cat.stores) {
      map.set(s.slug, { slug: s.slug, name: s.name })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

/** Case-insensitive substring match on store name; empty query → no matches. */
export function filterStoresByQuery(rows: StoreSearchRow[], raw: string, limit = 12): StoreSearchRow[] {
  const q = raw.trim().toLowerCase()
  if (!q) return []
  return rows.filter((r) => r.name.toLowerCase().includes(q)).slice(0, limit)
}
