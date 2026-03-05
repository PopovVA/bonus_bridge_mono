import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken, getAccessTokenForMutation } from '@/lib/auth'
import { ServiceCreateSchema, ServiceUpdateSchema, type Category, type Service } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createServiceAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const payload = ServiceCreateSchema.parse({
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    categoryId: String(formData.get('categoryId') ?? ''),
    website: String(formData.get('website') ?? '').trim() || undefined,
    logoSvg: String(formData.get('logoSvg') ?? '').trim() || undefined,
    description: String(formData.get('description') ?? '').trim() || undefined
  })

  await api.createService(payload)
  revalidatePath('/admin/services')
}

async function updateServiceAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = ServiceUpdateSchema.parse({
    name: String(formData.get('name') ?? '').trim() || undefined,
    website: String(formData.get('website') ?? '').trim() || undefined,
    logoSvg: String(formData.get('logoSvg') ?? '').trim() || undefined
  })

  await api.updateService(id, payload)
  revalidatePath('/admin/services')
}

export default async function ServicesAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let services: Service[] = []
  let categories: Category[] = []
  let loadError: string | null = null
  try {
    ;[services, categories] = await Promise.all([api.listServices(), api.listCategories()])
  } catch {
    loadError = 'Stores API is unavailable.'
  }

  return (
    <ResourceTable
      title="Stores"
      subtitle="Create and edit store name, icon, and outbound link."
      columns={['Name', 'Slug', 'Category', 'Website', 'Logo', 'Actions']}
      rows={services.map((service) => [
        service.name,
        service.slug,
        categories.find((c) => c.id === service.categoryId)?.name ?? service.categoryId,
        service.website ? (
          <a key={`${service.id}-website`} href={service.website} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          '-'
        ),
        service.logoSvg ? (
          <span key={`${service.id}-logo`} title="SVG logo" style={{ fontSize: 12 }}>
            SVG
          </span>
        ) : (
          '-'
        ),
        <form action={updateServiceAction} key={service.id} className="actions">
          <input type="hidden" name="id" value={service.id} />
          <input name="name" defaultValue={service.name} placeholder="Store name" aria-label="Store name" required />
          <input
            name="website"
            defaultValue={service.website ?? ''}
            placeholder="https://service.com"
            aria-label="Store website URL"
          />
          <textarea
            name="logoSvg"
            defaultValue={service.logoSvg ?? ''}
            placeholder="<svg>...</svg>"
            aria-label="Store logo SVG"
            rows={2}
            style={{ minWidth: 120 }}
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
            <input name="name" placeholder="Store name" aria-label="Store name" required />
            <input name="slug" placeholder="service-slug" aria-label="Store slug" required />
            <select name="categoryId" aria-label="Category" required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
            </select>
            <input name="website" placeholder="https://service.com" aria-label="Store website URL" />
            <textarea
              name="logoSvg"
              placeholder="<svg xmlns='...'>...</svg>"
              aria-label="Store logo SVG"
              rows={2}
              style={{ minWidth: 120 }}
            />
            <input name="description" placeholder="Description (optional)" aria-label="Store description" />
            <button className="btn primary" type="submit">
              Add store
            </button>
          </form>
        </>
      }
    />
  )
}
