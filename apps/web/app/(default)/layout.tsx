import { SiteHeader } from '@/components/site-header'
import { getCategories } from '@/lib/api-client'

export default async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch(() => [])

  return (
    <div className="container">
      <SiteHeader categories={categories} />
      <main style={{ marginTop: 24 }}>{children}</main>
    </div>
  )
}
