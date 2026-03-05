import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Returns the current access token for API calls (read-only, e.g. listing).
 * Use in Server Components — does not refresh, so cookies are not modified.
 */
export async function getAccessToken(): Promise<string | undefined> {
  if (!hasSupabaseEnv()) {
    return undefined
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return session?.access_token
}

/**
 * Returns a fresh access token for API mutations (create/update/delete).
 * Call ONLY from Server Actions — refreshes session and can update cookies.
 */
export async function getAccessTokenForMutation(): Promise<string | undefined> {
  if (!hasSupabaseEnv()) {
    return undefined
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return undefined
  }

  const { data: { session: refreshed } } = await supabase.auth.refreshSession()
  return (refreshed ?? session).access_token
}
