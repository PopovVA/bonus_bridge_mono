import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ServiceCreateSchema, ServiceUpdateSchema, type Service } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function getAccessToken() {
  if (!hasSupabaseEnv()) {
    return undefined
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()
  return session?.access_token
}

async function createServiceAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const payload = ServiceCreateSchema.parse({
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    categoryId: String(formData.get('categoryId') ?? ''),
    website: String(formData.get('website') ?? '').trim() || undefined,
    logoUrl: String(formData.get('logoUrl') ?? '').trim() || undefined,
    description: String(formData.get('description') ?? '').trim() || undefined
  })

  await api.createService(payload)
  revalidatePath('/admin/services')
}

async function updateServiceAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = ServiceUpdateSchema.parse({
    name: String(formData.get('name') ?? '').trim() || undefined,
    website: String(formData.get('website') ?? '').trim() || undefined,
    logoUrl: String(formData.get('logoUrl') ?? '').trim() || undefined
  })

  await api.updateService(id, payload)
  revalidatePath('/admin/services')
}

export default async function ServicesAdminPage() {
  const accessToken = await getAccessToken()
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
      subtitle="Create and edit service name, icon, and outbound service link."
      columns={['Name', 'Slug', 'Category ID', 'Website', 'Logo', 'Actions']}
      rows={services.map((service) => [
        service.name,
        service.slug,
        service.categoryId,
        service.website ? (
          <a key={`${service.id}-website`} href={service.website} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          '-'
        ),
        service.logoUrl ? (
          <a key={`${service.id}-logo`} href={service.logoUrl} target="_blank" rel="noreferrer">
            Icon
          </a>
        ) : (
          '-'
        ),
        <form action={updateServiceAction} key={service.id} className="actions">
          <input type="hidden" name="id" value={service.id} />
          <input name="name" defaultValue={service.name} placeholder="Service name" aria-label="Service name" required />
          <input
            name="website"
            defaultValue={service.website ?? ''}
            placeholder="https://service.com"
            aria-label="Service website URL"
          />
          <input
            name="logoUrl"
            defaultValue={service.logoUrl ?? ''}
            placeholder="https://cdn/logo.svg"
            aria-label="Service logo URL"
          />
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createServiceAction} className="actions">
            <input name="name" placeholder="Service name" aria-label="Service name" required />
            <input name="slug" placeholder="service-slug" aria-label="Service slug" required />
            <input name="categoryId" placeholder="Category UUID" aria-label="Category ID" required />
            <input name="website" placeholder="https://service.com" aria-label="Service website URL" />
            <input name="logoUrl" placeholder="https://cdn/logo.svg" aria-label="Service logo URL" />
            <input name="description" placeholder="Description (optional)" aria-label="Service description" />
            <button className="btn primary" type="submit">
              Add service
            </button>
          </form>
        </>
      }
    />
  )
}
