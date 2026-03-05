import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Offer } from '@bonusbridge/shared'

export default async function OffersAdminPage() {
  let accessToken: string | undefined
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    accessToken = session?.access_token
  }
  const api = createAdminApiClient(accessToken)
  let offers: Offer[] = []
  let loadError: string | null = null
  try {
    offers = await api.listOffers({ status: 'active' })
  } catch {
    loadError = 'Offers API is unavailable.'
  }

  return (
    <ResourceTable
      title="Offers"
      subtitle="Manage lifecycle of referral offers across services and countries."
      columns={['Title', 'Bonus', 'Status', 'Actions']}
      rows={offers.map((offer) => [
        offer.title,
        offer.bonusAmount ?? '-',
        offer.status,
        <span className="subtle" key={offer.id}>
          Read-only preview
        </span>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <select defaultValue="active" aria-label="Offer status filter">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <span className="subtle">Create flow: planned</span>
        </>
      }
    />
  )
}
