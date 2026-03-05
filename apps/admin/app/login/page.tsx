import { redirect } from 'next/navigation'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const nextPath = typeof params.next === 'string' ? params.next : '/admin'
  const errorCode = typeof params.error === 'string' ? params.error : null
  const errorMessage =
    errorCode === 'invalid_credentials'
      ? 'Invalid email or password.'
      : errorCode === 'missing_supabase_env'
        ? 'Supabase environment variables are missing.'
        : null

  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (user) {
      redirect(nextPath)
    }
  }

  return (
    <main className="shell">
      <section className="panel" style={{ maxWidth: 460, margin: '0 auto' }}>
        <h1 className="heading">
          Admin Sign In
        </h1>
        <p className="subtle" style={{ marginBottom: 14 }}>
          Scaffold login form for Supabase email/password auth.
        </p>
        {errorMessage ? (
          <p className="subtle" style={{ color: '#b42318', marginBottom: 14 }}>
            {errorMessage}
          </p>
        ) : null}
        {!hasSupabaseEnv() ? (
          <p className="subtle">Set Supabase env vars to enable authentication flow.</p>
        ) : (
          <form action="/auth/sign-in" method="post" className="grid">
            <input type="hidden" name="next" value={nextPath} />
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" name="email" placeholder="admin@example.com" required />
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input id="password" type="password" name="password" placeholder="Password" required />
            <button className="btn primary" type="submit">
              Sign in
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
