'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/lib/schemas'

/** Time each hero slide stays visible before auto-advance (ms). */
const HERO_AUTOPLAY_INTERVAL_MS = 30000

function headlineWithBonusAccent(text: string): ReactNode[] {
  return text.split(/(\$\d+)/g).map((part, i) =>
    /^\$\d+$/.test(part) ? (
      <span key={`${i}-${part}`} className="hero-chime-headline-accent">
        {part}
      </span>
    ) : (
      <span key={`${i}-t`}>{part}</span>
    )
  )
}

export function HeroSlider({ slides = [] }: { slides?: HeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    queueMicrotask(() => onSelect())
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return
    const interval = setInterval(() => emblaApi.scrollNext(), HERO_AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi, slides.length])

  if (slides.length === 0) return null

  const activeKind = slides[selectedIndex]?.kind ?? 'image'
  const showDotsBelow = slides.length > 1 && activeKind !== 'chime'

  return (
    <div className="hero-section" data-active-slide={activeKind}>
      <div ref={emblaRef} className="hero-embla-viewport">
        <div className="hero-embla-track">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`hero-slide-cell ${slide.kind === 'chime' ? 'hero-slide-cell--chime' : 'hero-slide-cell--image'}`}
            >
              <div
                className={`hero-slide ${slide.kind === 'image' ? 'hero-slide-image' : 'hero-slide-chime'}`}
              >
                {slide.kind === 'image' ? (
                  <>
                    <button
                      type="button"
                      className="hero-arrow hero-arrow-prev"
                      onClick={scrollPrev}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={22} strokeWidth={2.25} />
                    </button>
                    <button
                      type="button"
                      className="hero-arrow hero-arrow-next"
                      onClick={scrollNext}
                      aria-label="Next slide"
                    >
                      <ChevronRight size={22} strokeWidth={2.25} />
                    </button>
                    <div className="hero-image-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slide.imageUrl} alt="" className="hero-image" />
                    </div>
                  </>
                ) : (
                  <div
                    className="hero-chime-panel"
                    role="group"
                    aria-labelledby={`hero-chime-${slide.id}-headline`}
                  >
                    <div className="hero-chime-panel-inner">
                      <div className="hero-chime-stack">
                        <p className="hero-chime-brand">Chime</p>
                        {slide.eyebrow ? <p className="hero-chime-eyebrow">{slide.eyebrow}</p> : null}
                        <h2 id={`hero-chime-${slide.id}-headline`} className="hero-chime-headline">
                          {headlineWithBonusAccent(slide.headline)}
                        </h2>
                        {slide.promoHighlight ? (
                          <p className="hero-chime-promo-highlight">{slide.promoHighlight}</p>
                        ) : null}
                        <p className="hero-chime-sub">
                          {slide.subtext}{' '}
                          {slide.termsUrl ? (
                            <a
                              href={slide.termsUrl}
                              className="hero-chime-terms-link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {slide.termsLabel ?? 'View terms'}
                            </a>
                          ) : null}
                        </p>
                        <a
                          href={slide.referralUrl}
                          className="hero-chime-cta-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {slide.ctaText}
                        </a>
                        {slide.steps && slide.steps.length > 0 ? (
                          <>
                            <h3 className="hero-chime-steps-title">
                              {slide.stepsTitle ?? 'How it works'}
                            </h3>
                            <ol className="hero-chime-steps hero-chime-steps--compact">
                              {slide.steps.map((step, i) => (
                                <li key={i} className="hero-chime-step">
                                  <span className="hero-chime-step-num" aria-hidden>
                                    {i + 1}
                                  </span>
                                  <div className="hero-chime-step-body">
                                    <span className="hero-chime-step-title">{step.title}</span>
                                    {step.hint ? (
                                      <span className="hero-chime-step-hint">{step.hint}</span>
                                    ) : null}
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </>
                        ) : null}
                      </div>
                      {slides.length > 1 ? (
                        <div className="hero-chime-carousel-bar">
                          <button
                            type="button"
                            className="hero-chime-nav-btn"
                            onClick={scrollPrev}
                            aria-label="Previous slide"
                          >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                          </button>
                          <div className="hero-chime-dots" role="tablist" aria-label="Hero slides">
                            {slides.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={i === selectedIndex}
                                className={`hero-chime-dot ${i === selectedIndex ? 'active' : ''}`}
                                onClick={() => emblaApi?.scrollTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            className="hero-chime-nav-btn"
                            onClick={scrollNext}
                            aria-label="Next slide"
                          >
                            <ChevronRight size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showDotsBelow ? (
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot ${i === selectedIndex ? 'active' : ''}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
