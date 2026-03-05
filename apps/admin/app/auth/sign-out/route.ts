import { NextResponse } from 'next/server'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}
