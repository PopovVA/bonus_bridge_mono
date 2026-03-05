import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken, getAccessTokenForMutation } from '@/lib/auth'
import { PremiumBannerCreateSchema, PremiumBannerUpdateSchema, type PremiumBanner } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createPremiumBannerAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

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

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = PremiumBannerUpdateSchema.parse({
    title: String(formData.get('title') ?? '').trim() || undefined,
    description: String(formData.get('description') ?? '').trim() || undefined,
    priceText: String(formData.get('priceText') ?? '').trim() || undefined,
    priceNote: String(formData.get('priceNote') ?? '').trim() || undefined,
    ctaText: String(formData.get('ctaText') ?? '').trim() || undefined,
    ctaHref: String(formData.get('ctaHref') ?? '').trim() || undefined
  })

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(filtered).length === 0) return

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
    <ResourceTable
      title="Premium Banner"
      subtitle="Edit the Join Our Premium Membership banner content shown on the home page."
      columns={['Title', 'Description', 'Price', 'CTA', 'Actions']}
      rows={banners.map((b) => [
        b.title,
        <span key={`${b.id}-desc`} style={{ maxWidth: 200, fontSize: 13 }}>
          {b.description}
        </span>,
        `${b.priceText}${b.priceNote ? ` (${b.priceNote})` : ''}`,
        `${b.ctaText}${b.ctaHref ? ` → ${b.ctaHref}` : ''}`,
        <form action={updatePremiumBannerAction} key={b.id} className="actions">
          <input type="hidden" name="id" value={b.id} />
          <input name="title" defaultValue={b.title} placeholder="Title" aria-label="Title" required />
          <textarea
            name="description"
            defaultValue={b.description}
            placeholder="Description"
            aria-label="Description"
            rows={2}
            style={{ minWidth: 180 }}
          />
          <input name="priceText" defaultValue={b.priceText} placeholder="Price" aria-label="Price" required />
          <input name="priceNote" defaultValue={b.priceNote ?? ''} placeholder="Note (optional)" aria-label="Price note" />
          <input name="ctaText" defaultValue={b.ctaText} placeholder="CTA text" aria-label="CTA text" required />
          <input name="ctaHref" defaultValue={b.ctaHref ?? ''} placeholder="CTA link (optional)" aria-label="CTA link" />
          <button className="btn" type="submit">
            Save
          </button>
          <form action={deletePremiumBannerAction} style={{ display: 'inline' }}>
            <input type="hidden" name="id" value={b.id} />
            <button className="btn" type="submit">
              Delete
            </button>
          </form>
        </form>
      ])}
      actions={
        <>
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
        </>
      }
    />
  )
}
