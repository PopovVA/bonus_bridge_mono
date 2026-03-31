type Props = {
  message: string
  /** Defaults to home-style panel (matches category / store empty UI). */
  className?: string
}

export function EmptyState({ message, className = 'app-surface-card' }: Props) {
  return (
    <div className={className}>
      <p className="default-muted-text" style={{ margin: 0 }}>
        {message}
      </p>
    </div>
  )
}
