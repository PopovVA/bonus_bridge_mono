import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { getCategories, getServices } from '@/lib/site-data'
import { StoreSearchForm } from '@/components/store-search-form'

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, q } = await searchParams
  const title = q ? `Stores matching "${q}"` : category ? `Stores in category` : 'Stores'
  return {
    title: `${title} | BonusBridge`,
    description: 'Discover stores with referral bonuses and coupons.'
  }
}

export default async function StoresPage({ searchParams }: Props) {
  const { category, q } = await searchParams
  const storesPromise = getServices({ category: category ?? undefined, q: q ?? undefined }).catch(() => [])
  const categoriesPromise = getCategories().catch(() => [])
  const [stores, categories] = await Promise.all([storesPromise, categoriesPromise])
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return (
    <section>
      <h1 className="title">Stores</h1>
      <p className="meta">Referral bonuses and coupons by store.</p>
      <StoreSearchForm defaultValue={q ?? ''} category={category ?? ''} />
      {stores.length === 0 ? (
        <EmptyState message="No stores found. Try a different search or category." />
      ) : (
        <div className="list">
          {stores.map((store) => (
            <article key={store.id} className="card">
              <h2 className="section-title">{store.name}</h2>
              <p className="meta" style={{ marginTop: 0 }}>
                {store.categoryId && categoryMap[store.categoryId] ? categoryMap[store.categoryId] : null}
              </p>
              <div className="row">
                <Link href={`/stores/${store.slug}`}>View store</Link>
                {store.website ? (
                  <a href={store.website} target="_blank" rel="noreferrer">
                    Store link
                  </a>
                ) : null}
              </div>
              {store.description ? <p>{store.description}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
