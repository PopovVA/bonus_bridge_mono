import { TrackedLink } from '@/components/tracked-link'
import type { HomeCategoryChip } from '@/lib/site-data'

type Props = {
  chips: HomeCategoryChip[]
}

/** Enough repeated segments so wide viewports stay filled; CSS animates by -100/N %. */
const MARQUEE_VISUAL_COPIES = 10

type MarqueeLinkProps = {
  chip: HomeCategoryChip
  isPrimaryCopy: boolean
}

function MarqueeCategoryLink({ chip, isPrimaryCopy }: MarqueeLinkProps) {
  return (
    <TrackedLink
      href={chip.href}
      className="category-marquee-item"
      tabIndex={isPrimaryCopy ? undefined : -1}
      aria-hidden={isPrimaryCopy ? undefined : true}
      event="home_category_chip"
      eventParams={{ category_slug: chip.slug }}
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
    </TrackedLink>
  )
}

export function CategoryMarquee({ chips }: Props) {
  if (chips.length === 0) return null

  const animatedLoop = Array.from({ length: MARQUEE_VISUAL_COPIES }, (_, copyIdx) =>
    chips.map((chip, chipIdx) => (
      <MarqueeCategoryLink
        key={`${chip.slug}-anim-${copyIdx}-${chipIdx}`}
        chip={chip}
        isPrimaryCopy={copyIdx === 0}
      />
    ))
  ).flat()

  return (
    <section className="category-marquee-section" aria-label="Shop by category">
      <div className="category-marquee-viewport">
        <div className="category-marquee-track category-marquee-track--animated">{animatedLoop}</div>
        <div className="category-marquee-track category-marquee-track--static">
          {chips.map((chip, i) => (
            <MarqueeCategoryLink
              key={`${chip.slug}-static-${i}`}
              chip={chip}
              isPrimaryCopy
            />
          ))}
        </div>
      </div>
    </section>
  )
}
