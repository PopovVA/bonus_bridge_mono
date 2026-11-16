import { markdownByKind } from '@/lib/content-markdown'

type Params = { params: Promise<{ kind: string; slug: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { kind, slug } = await params
  const body = await markdownByKind(kind, slug)
  if (!body) {
    return new Response('Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
