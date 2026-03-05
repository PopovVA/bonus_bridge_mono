import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Referral } from '@bonusbridge/shared'

export default async function ReferralsAdminPage() {
  let accessToken: string | undefined
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    accessToken = session?.access_token
  }
  const api = createAdminApiClient(accessToken)
  let referrals: Referral[] = []
  let loadError: string | null = null
  try {
    referrals = await api.listReferrals('pending')
  } catch {
    loadError = 'Referrals API is unavailable.'
  }

  return (
    <ResourceTable
      title="Referral Moderation"
      subtitle="Review pending referrals and approve/reject safely."
      columns={['Offer ID', 'Email', 'Status', 'Actions']}
      rows={referrals.map((referral) => [
        referral.offerId,
        referral.email ?? '-',
        referral.status,
        <span className="subtle" key={referral.id}>
          Moderation flow: planned
        </span>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <select defaultValue="pending" aria-label="Referral status filter">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </>
      }
    />
  )
}
