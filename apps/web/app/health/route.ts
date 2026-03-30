import { NextResponse } from 'next/server'

/** Lightweight check for load balancers — no data layer, no external fetches */
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
