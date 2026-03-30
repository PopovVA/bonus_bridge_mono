import http from 'node:http'
import https from 'node:https'
import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

function nodeFetch(
  url: URL,
  method: string,
  headers: Record<string, string>,
  bodyStr: string | undefined
): Promise<{ status: number; headers: Record<string, string>; text: () => Promise<string> }> {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: bodyStr
        ? { ...headers, 'Content-Length': Buffer.byteLength(bodyStr, 'utf8') }
        : headers
    }
    const mod = url.protocol === 'https:' ? https : http
    const req = mod.request(opts, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (ch: Buffer) => chunks.push(ch))
      res.on('end', () => {
        const h: Record<string, string> = {}
        for (const [k, v] of Object.entries(res.headers)) {
          if (typeof v === 'string') h[k] = v
        }
        resolve({
          status: res.statusCode ?? 500,
          headers: h,
          text: async () => Buffer.concat(chunks).toString('utf8')
        })
      })
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr, 'utf8')
    req.end()
  })
}

/**
 * Proxies admin API mutations. Accepts POST with { path, method, body }.
 * Uses Node.js http(s) for reliable body forwarding.
 */
export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  if (auth) headers.Authorization = auth

  let envelope: { path: string; method: 'PATCH' | 'POST' | 'DELETE'; body?: unknown }
  try {
    envelope = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { path, method, body } = envelope
  if (!path || typeof path !== 'string') {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }
  if (!['PATCH', 'POST', 'DELETE'].includes(method)) {
    return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
  }

  let bodyToSend: unknown = body
  if (typeof body === 'string' && method !== 'DELETE') {
    try {
      bodyToSend = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid body: expected JSON object' }, { status: 400 })
    }
  }

  const url = new URL(path, env.apiBaseUrl)
  const bodyStr = method !== 'DELETE' && bodyToSend !== undefined ? JSON.stringify(bodyToSend) : undefined

  const res = await nodeFetch(url, method, headers, bodyStr)

  const text = await res.text()
  if (res.status >= 400) {
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: text }, { status: res.status })
    }
    return NextResponse.json(json, { status: res.status })
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': res.headers['content-type'] ?? 'application/json' }
    })
  }
}
