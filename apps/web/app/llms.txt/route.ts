import { buildLlmsTxt } from '@/lib/llms-txt'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'

export async function GET() {
  const body = buildLlmsTxt(await listPublicSitemapPaths())
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
