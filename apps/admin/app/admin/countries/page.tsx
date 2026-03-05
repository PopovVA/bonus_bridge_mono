import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Country } from '@bonusbridge/shared'

export default async function CountriesAdminPage() {
  let accessToken: string | undefined
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    accessToken = session?.access_token
  }
  const api = createAdminApiClient(accessToken)
  let countries: Country[] = []
  let loadError: string | null = null
  try {
    countries = await api.listCountries()
  } catch {
    loadError = 'Countries API is unavailable.'
  }

  return (
    <ResourceTable
      title="Countries"
      subtitle="Manage available markets and ISO-like country codes."
      columns={['Name', 'Code', 'Actions']}
      rows={countries.map((country) => [
        country.name,
        country.code,
        <span className="subtle" key={country.id}>
          Read-only preview
        </span>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <label className="sr-only" htmlFor="countries-search">
            Search country
          </label>
          <input id="countries-search" placeholder="Search country" name="q" />
          <span className="subtle">Create flow: planned</span>
        </>
      }
    />
  )
}
