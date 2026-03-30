import { EditablePremiumBannerRow } from '@/components/editable-premium-banner-row'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken, getAccessTokenForMutation } from '@/lib/auth'
import { PremiumBannerCreateSchema, PremiumBannerUpdateSchema, type PremiumBanner } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createPremiumBannerAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) return

  const api = createAdminApiClient(accessToken)
  const payload = PremiumBannerCreateSchema.parse({
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    priceText: String(formData.get('priceText') ?? ''),
    priceNote: String(formData.get('priceNote') ?? '').trim() || undefined,
    ctaText: String(formData.get('ctaText') ?? ''),
    ctaHref: String(formData.get('ctaHref') ?? '').trim() || undefined
  })

  await api.createPremiumBanner(payload)
  revalidatePath('/admin/premium-banner')
}

async function updatePremiumBannerAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return

  const api = createAdminApiClient(accessToken)
  const toStr = (v: FormDataEntryValue | null) => String(v ?? '').trim()
  const title = toStr(formData.get('title'))
  const description = toStr(formData.get('description'))
  const priceText = toStr(formData.get('priceText'))
  const ctaText = toStr(formData.get('ctaText'))
  if (!title || !description || !priceText || !ctaText) return

  const payload: Record<string, string | null> = {
    title,
    description,
    priceText,
    priceNote: toStr(formData.get('priceNote')) || null,
    ctaText,
    ctaHref: toStr(formData.get('ctaHref')) || null
  }

  PremiumBannerUpdateSchema.parse(payload)

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v != null)
  ) as Record<string, string>
  await api.updatePremiumBanner(id, filtered)
  revalidatePath('/admin/premium-banner')
}

async function deletePremiumBannerAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  await api.deletePremiumBanner(id)
  revalidatePath('/admin/premium-banner')
}

export default async function PremiumBannerAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let banners: PremiumBanner[] = []
  let loadError: string | null = null
  try {
    banners = await api.listPremiumBanners()
  } catch {
    loadError = 'Premium banner API is unavailable.'
  }

  return (
    <section className="panel grid">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h2 className="heading" style={{ marginBottom: 6 }}>
            Premium Banner
          </h2>
          <p className="subtle">
            Edit the Join Our Premium Membership banner content shown on the home page.
          </p>
        </div>
        <div className="actions">
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createPremiumBannerAction} className="actions">
            <input name="title" placeholder="Title" aria-label="Title" required />
            <textarea name="description" placeholder="Description" aria-label="Description" rows={2} style={{ minWidth: 180 }} />
            <input name="priceText" placeholder="$9.99/month" aria-label="Price" required />
            <input name="priceNote" placeholder="First month free" aria-label="Price note" />
            <input name="ctaText" placeholder="Start Free Trial" aria-label="CTA text" required />
            <input name="ctaHref" placeholder="https://..." aria-label="CTA link" />
            <button className="btn primary" type="submit">
              Add banner
            </button>
          </form>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>CTA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.length === 0 ? (
            <tr>
              <td colSpan={5} className="subtle">
                No records. Check API or create new entities.
              </td>
            </tr>
          ) : (
            banners.map((banner) => (
              <EditablePremiumBannerRow
                key={banner.id}
                banner={banner}
                updateAction={updatePremiumBannerAction}
                deleteAction={deletePremiumBannerAction}
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
