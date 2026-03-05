import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { OfferCreateSchema, OfferUpdateSchema, type Offer, type Service } from '@bonusbridge/shared'
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

async function createCouponAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const couponCodeRaw = String(formData.get('couponCode') ?? '').trim()
  const payload = OfferCreateSchema.parse({
    title: String(formData.get('title') ?? ''),
    previewText: String(formData.get('previewText') ?? ''),
    couponCode: couponCodeRaw || undefined,
    serviceId: String(formData.get('serviceId') ?? ''),
    referralUrl: String(formData.get('referralUrl') ?? ''),
    bonusAmount: String(formData.get('bonusAmount') ?? '').trim() || undefined,
    description: String(formData.get('description') ?? '').trim() || undefined,
    terms: String(formData.get('terms') ?? '').trim() || undefined,
    status: String(formData.get('status') ?? 'draft')
  })

  await api.createOffer(payload)
  revalidatePath('/admin/offers')
}

async function updateCouponAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const couponCodeRaw = String(formData.get('couponCode') ?? '').trim()
  const payload = OfferUpdateSchema.parse({
    title: String(formData.get('title') ?? '').trim() || undefined,
    previewText: String(formData.get('previewText') ?? '').trim() || undefined,
    couponCode: couponCodeRaw === '' ? null : couponCodeRaw,
    referralUrl: String(formData.get('referralUrl') ?? '').trim() || undefined,
    status: String(formData.get('status') ?? '').trim() || undefined
  })

  await api.updateOffer(id, payload)
  revalidatePath('/admin/offers')
}

export default async function OffersAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)

  let offers: Offer[] = []
  let services: Service[] = []
  let loadError: string | null = null
  try {
    ;[offers, services] = await Promise.all([api.listOffers({}), api.listServices()])
  } catch {
    loadError = 'Coupons API is unavailable.'
  }

  return (
    <ResourceTable
      title="Coupons"
      subtitle="Create and manage promo codes with preview text and copy-ready code."
      columns={['Title', 'Preview', 'Coupon Code', 'Store', 'Status', 'Actions']}
      rows={offers.map((offer) => [
        offer.title,
        offer.previewText,
        offer.couponCode ?? '-',
        services.find((s) => s.id === offer.serviceId)?.name ?? offer.serviceId,
        offer.status,
        <form action={updateCouponAction} key={offer.id} className="actions">
          <input type="hidden" name="id" value={offer.id} />
          <input name="title" defaultValue={offer.title} placeholder="Title" aria-label="Coupon title" required />
          <input
            name="previewText"
            defaultValue={offer.previewText}
            placeholder="Preview text"
            aria-label="Coupon preview text"
            required
          />
          <input
            name="couponCode"
            defaultValue={offer.couponCode ?? ''}
            placeholder="Coupon code"
            aria-label="Coupon code"
          />
          <input
            name="referralUrl"
            defaultValue={offer.referralUrl}
            placeholder="https://referral.example"
            aria-label="Coupon referral URL"
            required
          />
          <select name="status" defaultValue={offer.status} aria-label="Coupon status">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createCouponAction} className="actions">
            <input name="title" placeholder="Coupon title" aria-label="Coupon title" required />
            <input name="previewText" placeholder="Preview text" aria-label="Coupon preview text" required />
            <input name="couponCode" placeholder="Coupon code (optional)" aria-label="Coupon code" />
            <input name="referralUrl" placeholder="https://referral.example" aria-label="Coupon referral URL" required />
            <select name="serviceId" defaultValue="" aria-label="Store for coupon" required>
              <option value="" disabled>
                Select store
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.slug})
                </option>
              ))}
            </select>
            <select name="status" defaultValue="active" aria-label="Coupon status">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <input name="bonusAmount" placeholder="Bonus text (optional)" aria-label="Bonus amount text" />
            <input name="description" placeholder="Description (optional)" aria-label="Coupon description" />
            <input name="terms" placeholder="Terms (optional)" aria-label="Coupon terms" />
            <button className="btn primary" type="submit">
              Add coupon
            </button>
          </form>
        </>
      }
    />
  )
}
