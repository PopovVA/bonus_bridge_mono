import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HeroImageCreateSchema, HeroImageUpdateSchema, type HeroImage } from '@bonusbridge/shared'
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

async function createHeroImageAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const payload = HeroImageCreateSchema.parse({
    imageUrl: String(formData.get('imageUrl') ?? '').trim(),
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  await api.createHeroImage(payload)
  revalidatePath('/admin/hero-images')
}

async function updateHeroImageAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = HeroImageUpdateSchema.parse({
    imageUrl: String(formData.get('imageUrl') ?? '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(filtered).length === 0) return

  await api.updateHeroImage(id, filtered)
  revalidatePath('/admin/hero-images')
}

async function deleteHeroImageAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  await api.deleteHeroImage(id)
  revalidatePath('/admin/hero-images')
}

export default async function HeroImagesAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let images: HeroImage[] = []
  let loadError: string | null = null
  try {
    images = await api.listHeroImages()
  } catch {
    loadError = 'Hero images API is unavailable.'
  }

  return (
    <ResourceTable
      title="Hero Images"
      subtitle="Edit images shown on the home page hero slider. All images should have the same size."
      columns={['Preview', 'URL', 'Order', 'Actions']}
      rows={images.map((img) => [
        img.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={img.id}
            src={img.imageUrl}
            alt=""
            style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          '-'
        ),
        <span key={`${img.id}-url`} style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {img.imageUrl}
        </span>,
        img.sortOrder,
        <form action={updateHeroImageAction} key={img.id} className="actions">
          <input type="hidden" name="id" value={img.id} />
          <input
            name="imageUrl"
            defaultValue={img.imageUrl}
            placeholder="https://..."
            aria-label="Image URL"
            required
            style={{ minWidth: 200 }}
          />
          <input
            name="sortOrder"
            type="number"
            defaultValue={img.sortOrder}
            aria-label="Sort order"
            style={{ width: 60 }}
          />
          <button className="btn" type="submit">
            Save
          </button>
          <form action={deleteHeroImageAction} style={{ display: 'inline' }}>
            <input type="hidden" name="id" value={img.id} />
            <button className="btn" type="submit">
              Delete
            </button>
          </form>
        </form>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createHeroImageAction} className="actions">
            <input
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              aria-label="Image URL"
              required
              style={{ minWidth: 200 }}
            />
            <input name="sortOrder" type="number" placeholder="0" aria-label="Sort order" defaultValue={0} style={{ width: 60 }} />
            <button className="btn primary" type="submit">
              Add image
            </button>
          </form>
        </>
      }
    />
  )
}
