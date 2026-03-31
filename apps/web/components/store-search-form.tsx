import React from 'react'

type Props = {
  defaultValue?: string
  category?: string
}

export function StoreSearchForm({ defaultValue = '', category = '' }: Props) {
  return (
    <form action="/" method="get" className="row" style={{ marginBottom: 16 }}>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search stores..."
        aria-label="Search stores"
        className="search-input"
      />
      {category ? <input type="hidden" name="category" value={category} /> : null}
      <button type="submit" className="copy-btn">
        Search
      </button>
    </form>
  )
}
