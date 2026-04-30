import { SITE_FOOTER_DISCLAIMER } from '@/lib/site-disclaimers'

type Props = {
  className?: string
}

export function SiteDisclosure({ className = '' }: Props) {
  const classes = ['site-disclosure app-surface-card', className].filter(Boolean).join(' ')

  return (
    <aside className={classes} aria-label="Affiliate disclosure">
      <p>{SITE_FOOTER_DISCLAIMER}</p>
    </aside>
  )
}
