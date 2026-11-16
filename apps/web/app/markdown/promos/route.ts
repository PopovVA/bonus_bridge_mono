import { renderPromosMarkdown } from '@/lib/promo-entries'
import { promos } from '@/lib/promos'
import { getServices } from '@/lib/site-data'

export const revalidate = 3600

export async function GET() {
  const stores = await getServices()
  const knownSlugs = new Set(stores.map((store) => store.slug))
  const body = renderPromosMarkdown(promos, new Date(), knownSlugs)
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
