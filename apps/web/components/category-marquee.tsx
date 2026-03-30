import Link from 'next/link'
import type { HomeCategoryChip } from '@/lib/site-data'

type Props = {
  chips: HomeCategoryChip[]
}

export function CategoryMarquee({ chips }: Props) {
  if (chips.length === 0) return null

  const loop = [...chips, ...chips]

  return (
    <section className="category-marquee-section" aria-label="Shop by category">
      <div className="category-marquee-viewport">
        <div className="category-marquee-track">
          {loop.map((chip, i) => (
            <Link
              key={`${chip.slug}-${i}`}
              href={chip.href}
              className="category-marquee-item"
            >
              <span className="category-marquee-icon-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element -- small static tiles; avoids test Image mock */}
                <img
                  src={chip.imageSrc}
                  alt=""
                  width={80}
                  height={80}
                  className="category-marquee-img"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="category-marquee-label">{chip.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
