import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken, getAccessTokenForMutation } from '@/lib/auth'
import { FeaturedStoreCreateSchema, FeaturedStoreUpdateSchema, type FeaturedStore, type Service } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createFeaturedStoreAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const payload = FeaturedStoreCreateSchema.parse({
    storeId: String(formData.get('storeId') ?? ''),
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  await api.createFeaturedStore(payload)
  revalidatePath('/admin/featured-stores')
}

async function updateFeaturedStoreAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = FeaturedStoreUpdateSchema.parse({
    storeId: String(formData.get('storeId') ?? '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(filtered).length === 0) return

  await api.updateFeaturedStore(id, filtered)
  revalidatePath('/admin/featured-stores')
}

async function deleteFeaturedStoreAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  await api.deleteFeaturedStore(id)
  revalidatePath('/admin/featured-stores')
}

export default async function FeaturedStoresAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let featuredStores: FeaturedStore[] = []
  let services: Service[] = []
  let loadError: string | null = null
  try {
    ;[featuredStores, services] = await Promise.all([
      api.listFeaturedStores(),
      api.listServices()
    ])
  } catch {
    loadError = 'Featured stores API is unavailable.'
  }

  const storeIds = new Set(featuredStores.map((fs) => fs.storeId))
  const availableStores = services.filter((s) => !storeIds.has(s.id))

  return (
    <ResourceTable
      title="Top Stores"
      subtitle="Select stores to display in the Top Cashback Stores section on the home page."
      columns={['Store', 'Order', 'Actions']}
      rows={featuredStores.map((fs) => {
        const store = services.find((s) => s.id === fs.storeId)
        return [
          store?.name ?? fs.storeId,
          fs.sortOrder,
          <form action={updateFeaturedStoreAction} key={fs.id} className="actions">
            <input type="hidden" name="id" value={fs.id} />
            <select name="storeId" aria-label="Store" defaultValue={fs.storeId}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              name="sortOrder"
              type="number"
              defaultValue={fs.sortOrder}
              aria-label="Sort order"
              style={{ width: 60 }}
            />
            <button className="btn" type="submit">
              Save
            </button>
            <form action={deleteFeaturedStoreAction} style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={fs.id} />
              <button className="btn" type="submit">
                Remove
              </button>
            </form>
          </form>
        ]
      })}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createFeaturedStoreAction} className="actions">
            <select name="storeId" aria-label="Store" required>
              <option value="">Select store</option>
              {availableStores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              {availableStores.length === 0 && services.length > 0 ? (
                <option value="" disabled>
                  All stores already added
                </option>
              ) : null}
            </select>
            <input name="sortOrder" type="number" placeholder="0" aria-label="Sort order" defaultValue={0} style={{ width: 60 }} />
            <button className="btn primary" type="submit" disabled={availableStores.length === 0}>
              Add store
            </button>
          </form>
        </>
      }
    />
  )
}
