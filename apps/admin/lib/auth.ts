import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Returns the current access token for API calls.
 * Note: refreshSession() cannot be used here — it modifies cookies,
 * which is only allowed in Server Actions/Route Handlers, not in Server Components.
 * If you get 401 from expired token, log out and sign in again.
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
