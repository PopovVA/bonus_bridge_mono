import { ResourceTable } from '@/components/resource-table'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { hasSupabaseEnv } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Category } from '@bonusbridge/shared'

export default async function CategoriesAdminPage() {
  let accessToken: string | undefined
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()
    accessToken = session?.access_token
  }
  const api = createAdminApiClient(accessToken)
  let categories: Category[] = []
  let loadError: string | null = null
  try {
    categories = await api.listCategories()
  } catch {
    loadError = 'Categories API is unavailable.'
  }

  return (
    <ResourceTable
      title="Categories"
      subtitle="Group services by a stable taxonomy used in web filters."
      columns={['Name', 'Slug', 'Actions']}
      rows={categories.map((category) => [
        category.name,
        category.slug,
        <span className="subtle" key={category.id}>
          Read-only preview
        </span>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <label className="sr-only" htmlFor="categories-search">
            Search category
          </label>
          <input id="categories-search" placeholder="Search category" name="q" />
          <span className="subtle">Create flow: planned</span>
        </>
      }
    />
  )
}
