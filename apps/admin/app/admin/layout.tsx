import Link from 'next/link'

const links = [
  { href: '/admin/countries', label: 'Countries' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/offers', label: 'Offers' },
  { href: '/admin/referrals', label: 'Referrals' }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="shell">
      <header className="topbar panel" style={{ marginBottom: 14 }}>
        <div>
          <p className="heading" style={{ marginBottom: 4 }}>
            Bonus Bridge Admin
          </p>
          <p className="subtle">CRUD + moderation scaffold with typed API clients.</p>
        </div>
        <form action="/auth/sign-out" method="post">
          <button className="btn" type="submit">
            Sign out
          </button>
        </form>
      </header>

      <nav className="topnav" style={{ marginBottom: 14 }}>
        {links.map((link) => (
          <Link className="badge" key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  )
}
