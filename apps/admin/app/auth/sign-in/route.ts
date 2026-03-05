import { NextResponse } from 'next/server'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const nextPath = String(formData.get('next') ?? '/admin')
  const safeNextPath =
    nextPath.startsWith('/admin') && !nextPath.startsWith('//') ? nextPath : '/admin'

  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(new URL('/login?error=missing_supabase_env', request.url))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.redirect(new URL('/login?error=invalid_credentials', request.url))
  }

  return NextResponse.redirect(new URL(safeNextPath, request.url))
}
