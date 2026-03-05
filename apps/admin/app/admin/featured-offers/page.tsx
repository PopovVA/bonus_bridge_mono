import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken } from '@/lib/auth'
import { FeaturedOfferCreateSchema, FeaturedOfferUpdateSchema, type FeaturedOffer, type Offer } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createFeaturedOfferAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const payload = FeaturedOfferCreateSchema.parse({
    offerId: String(formData.get('offerId') ?? ''),
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  await api.createFeaturedOffer(payload)
  revalidatePath('/admin/featured-offers')
}

async function updateFeaturedOfferAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const payload = FeaturedOfferUpdateSchema.parse({
    offerId: String(formData.get('offerId') ?? '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') ?? 0)
  })

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(filtered).length === 0) return

  await api.updateFeaturedOffer(id, filtered)
  revalidatePath('/admin/featured-offers')
}

async function deleteFeaturedOfferAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  await api.deleteFeaturedOffer(id)
  revalidatePath('/admin/featured-offers')
}

export default async function FeaturedOffersAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let featuredOffers: FeaturedOffer[] = []
  let offers: Offer[] = []
  let loadError: string | null = null
  try {
    ;[featuredOffers, offers] = await Promise.all([
      api.listFeaturedOffers(),
      api.listOffers({ status: 'active' })
    ])
  } catch {
    loadError = 'Featured offers API is unavailable.'
  }

  const offerIds = new Set(featuredOffers.map((fo) => fo.offerId))
  const availableOffers = offers.filter((o) => !offerIds.has(o.id))

  return (
    <ResourceTable
      title="Top Promo Codes"
      subtitle="Select offers to display in the Hot Promo Codes section on the home page."
      columns={['Offer', 'Order', 'Actions']}
      rows={featuredOffers.map((fo) => {
        const offer = offers.find((o) => o.id === fo.offerId)
        return [
          offer ? `${offer.title} (${offer.previewText.slice(0, 40)}...)` : fo.offerId,
          fo.sortOrder,
          <form action={updateFeaturedOfferAction} key={fo.id} className="actions">
            <input type="hidden" name="id" value={fo.id} />
            <select name="offerId" aria-label="Offer" defaultValue={fo.offerId} style={{ minWidth: 200 }}>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
            <input
              name="sortOrder"
              type="number"
              defaultValue={fo.sortOrder}
              aria-label="Sort order"
              style={{ width: 60 }}
            />
            <button className="btn" type="submit">
              Save
            </button>
            <form action={deleteFeaturedOfferAction} style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={fo.id} />
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
          <form action={createFeaturedOfferAction} className="actions">
            <select name="offerId" aria-label="Offer" required style={{ minWidth: 200 }}>
              <option value="">Select offer</option>
              {availableOffers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
              {availableOffers.length === 0 && offers.length > 0 ? (
                <option value="" disabled>
                  All offers already added
                </option>
              ) : null}
            </select>
            <input name="sortOrder" type="number" placeholder="0" aria-label="Sort order" defaultValue={0} style={{ width: 60 }} />
            <button className="btn primary" type="submit" disabled={availableOffers.length === 0}>
              Add offer
            </button>
          </form>
        </>
      }
    />
  )
}
