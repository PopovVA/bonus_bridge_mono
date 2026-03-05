import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Service } from '@bonusbridge/shared'

export default async function ServicesAdminPage() {
  let accessToken: string | undefined
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    accessToken = session?.access_token
  }
  const api = createAdminApiClient(accessToken)
  let services: Service[] = []
  let loadError: string | null = null
  try {
    services = await api.listServices()
  } catch {
    loadError = 'Services API is unavailable.'
  }

  return (
    <ResourceTable
      title="Services"
      subtitle="Service catalog entities linked to categories and offers."
      columns={['Name', 'Slug', 'Category ID', 'Actions']}
      rows={services.map((service) => [
        service.name,
        service.slug,
        service.categoryId,
        <span className="subtle" key={service.id}>
          Read-only preview
        </span>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <label className="sr-only" htmlFor="services-search">
            Search service
          </label>
          <input id="services-search" placeholder="Search service" name="q" />
          <span className="subtle">Create flow: planned</span>
        </>
      }
    />
  )
}
