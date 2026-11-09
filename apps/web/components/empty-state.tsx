import Link from 'next/link'

export type EmptyStateAction = {
  href: string
  label: string
}

type Props = {
  message: string
  title?: string
  /** First action renders as the primary button, the rest as chips. */
  actions?: EmptyStateAction[]
  className?: string
}

/** A bridge with its middle span missing: "nothing to cross to yet". */
function EmptyBridgeArt() {
  return (
    <svg className="empty-state__art" viewBox="0 0 240 90" aria-hidden="true" focusable="false">
      <path className="empty-state__deck" d="M8 66 H92 M148 66 H232" />
      <path className="empty-state__tower" d="M64 78 V18 M176 78 V18" />
      <path className="empty-state__cable" d="M8 52 Q40 44 64 18 Q78 40 92 50 M148 50 Q162 40 176 18 Q200 44 232 52" />
      <path className="empty-state__gap" d="M98 66 H142" />
    </svg>
  )
}

export function EmptyState({ message, title, actions = [], className = 'app-surface-card' }: Props) {
  const [primary, ...rest] = actions
  return (
    <div className={`empty-state ${className}`}>
      <EmptyBridgeArt />
      {title ? <h2 className="empty-state__title">{title}</h2> : null}
      <p className="empty-state__text">{message}</p>
      {primary ? (
        <div className="empty-state__actions">
          <Link href={primary.href} className="btn btn--primary" data-magnetic>
            {primary.label}
          </Link>
          {rest.map((a) => (
            <Link key={a.href} href={a.href} className="empty-state__chip">
              {a.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
