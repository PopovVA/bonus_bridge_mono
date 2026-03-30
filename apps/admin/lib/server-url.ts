import { headers } from 'next/headers'

export async function getServerRequestOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3002'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}`
}
