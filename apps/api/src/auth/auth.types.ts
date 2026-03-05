export type AuthenticatedUser = {
  sub: string
  email?: string
  role: 'admin' | 'user'
  raw: Record<string, unknown>
}
