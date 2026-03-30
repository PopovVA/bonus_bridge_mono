import { NextResponse } from 'next/server'

/** Railway / load balancer healthcheck — no Supabase or heavy SSR */
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
