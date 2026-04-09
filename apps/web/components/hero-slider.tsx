'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/lib/schemas'

/** Time each hero slide stays visible before auto-advance (ms). */
const HERO_AUTOPLAY_INTERVAL_MS = 30000

type PromoKind = 'chime' | 'coinbase' | 'paypal' | 'uber' | 'ubereats'

type PromoSlide = Extract<HeroSlide, { kind: PromoKind }>

type BrandfetchLogoKind = 'ubereats'

type VectorLogoKind = Exclude<PromoKind, BrandfetchLogoKind | 'uber'>

const VECTOR_BRAND_LOGO: Record<VectorLogoKind, { src: string }> = {
  chime: {
    src: 'https://www.vectorlogo.zone/logos/chimebank/chimebank-ar21.svg'
  },
  coinbase: {
    src: 'https://www.vectorlogo.zone/logos/coinbase/coinbase-ar21.svg'
  },
  paypal: {
    src: 'https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg'
  }
}

/**
 * Uber Eats: [Brandfetch Logo API](https://docs.brandfetch.com/docs/logo-link/guidelines) needs
 * `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` (free tier). Uber rides uses bundled `/brands/uber-logo.png`.
 */
function promoBrandLogoSrc(kind: PromoKind): string {
  if (kind === 'uber') {
    return '/brands/uber-logo.png'
  }
  if (kind === 'ubereats') {
    const id = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID?.trim()
    if (id) {
      return `https://cdn.brandfetch.io/ubereats.com/w/320/h/120?c=${encodeURIComponent(id)}`
    }
    return '/brands/ubereats-logo.png'
  }
  return VECTOR_BRAND_LOGO[kind].src
}

const PROMO_UI: Record<
  PromoKind,
  {
    slide: string
    panel: string
    panelInner: string
    stack: string
    eyebrow: string
    headline: string
    moneyAccent: string
    promoHl: string
    sub: string
    terms: string
    cta: string
    stepsTitle: string
    steps: string
    step: string
    stepNum: string
    stepBody: string
    stepTitle: string
    stepHint: string
    brandAlt: string
  }
> = {
  chime: {
    slide: 'hero-slide-chime',
    panel: 'hero-chime-panel',
    panelInner: 'hero-chime-panel-inner',
    stack: 'hero-chime-stack',
    eyebrow: 'hero-chime-eyebrow',
    headline: 'hero-chime-headline',
    moneyAccent: 'hero-chime-headline-accent',
    promoHl: 'hero-chime-promo-highlight',
    sub: 'hero-chime-sub',
    terms: 'hero-chime-terms-link',
    cta: 'hero-chime-cta-primary',
    stepsTitle: 'hero-chime-steps-title',
    steps: 'hero-chime-steps hero-chime-steps--compact',
    step: 'hero-chime-step',
    stepNum: 'hero-chime-step-num',
    stepBody: 'hero-chime-step-body',
    stepTitle: 'hero-chime-step-title',
    stepHint: 'hero-chime-step-hint',
    brandAlt: 'Chime'
  },
  coinbase: {
    slide: 'hero-slide-coinbase',
    panel: 'hero-coinbase-panel',
    panelInner: 'hero-coinbase-panel-inner',
    stack: 'hero-coinbase-stack',
    eyebrow: 'hero-coinbase-eyebrow',
    headline: 'hero-coinbase-headline',
    moneyAccent: 'hero-coinbase-money-accent',
    promoHl: 'hero-coinbase-promo-highlight',
    sub: 'hero-coinbase-sub',
    terms: 'hero-coinbase-terms-link',
    cta: 'hero-coinbase-cta-primary',
    stepsTitle: 'hero-chime-steps-title',
    steps: 'hero-chime-steps hero-chime-steps--compact',
    step: 'hero-chime-step',
    stepNum: 'hero-chime-step-num',
    stepBody: 'hero-chime-step-body',
    stepTitle: 'hero-chime-step-title',
    stepHint: 'hero-chime-step-hint',
    brandAlt: 'Coinbase'
  },
  paypal: {
    slide: 'hero-slide-paypal',
    panel: 'hero-paypal-panel',
    panelInner: 'hero-paypal-panel-inner',
    stack: 'hero-paypal-stack',
    eyebrow: 'hero-paypal-eyebrow',
    headline: 'hero-paypal-headline',
    moneyAccent: 'hero-paypal-money-accent',
    promoHl: 'hero-paypal-promo-highlight',
    sub: 'hero-paypal-sub',
    terms: 'hero-paypal-terms-link',
    cta: 'hero-paypal-cta-primary',
    stepsTitle: 'hero-paypal-steps-title',
    steps: 'hero-paypal-steps',
    step: 'hero-paypal-step',
    stepNum: 'hero-paypal-step-num',
    stepBody: 'hero-paypal-step-body',
    stepTitle: 'hero-paypal-step-title',
    stepHint: 'hero-paypal-step-hint',
    brandAlt: 'PayPal'
  },
  uber: {
    slide: 'hero-slide-uber',
    panel: 'hero-uber-panel',
    panelInner: 'hero-uber-panel-inner',
    stack: 'hero-uber-stack',
    eyebrow: 'hero-uber-eyebrow',
    headline: 'hero-uber-headline',
    moneyAccent: 'hero-uber-money-accent',
    promoHl: 'hero-uber-promo-highlight',
    sub: 'hero-uber-sub',
    terms: 'hero-uber-terms-link',
    cta: 'hero-uber-cta-primary',
    stepsTitle: 'hero-paypal-steps-title',
    steps: 'hero-paypal-steps',
    step: 'hero-paypal-step',
    stepNum: 'hero-paypal-step-num',
    stepBody: 'hero-paypal-step-body',
    stepTitle: 'hero-paypal-step-title',
    stepHint: 'hero-paypal-step-hint',
    brandAlt: 'Uber'
  },
  ubereats: {
    slide: 'hero-slide-ubereats',
    panel: 'hero-ubereats-panel',
    panelInner: 'hero-ubereats-panel-inner',
    stack: 'hero-ubereats-stack',
    eyebrow: 'hero-ubereats-eyebrow',
    headline: 'hero-ubereats-headline',
    moneyAccent: 'hero-ubereats-money-accent',
    promoHl: 'hero-ubereats-promo-highlight',
    sub: 'hero-ubereats-sub',
    terms: 'hero-ubereats-terms-link',
    cta: 'hero-ubereats-cta-primary',
    stepsTitle: 'hero-paypal-steps-title',
    steps: 'hero-paypal-steps',
    step: 'hero-paypal-step',
    stepNum: 'hero-paypal-step-num',
    stepBody: 'hero-paypal-step-body',
    stepTitle: 'hero-paypal-step-title',
    stepHint: 'hero-paypal-step-hint',
    brandAlt: 'Uber Eats'
  }
}

function moneyAccentSpans(text: string, accentClass: string): ReactNode[] {
  return text.split(/(\$\d+)/g).map((part, i) =>
    /^\$\d+$/.test(part) ? (
      <span key={`${i}-${part}`} className={accentClass}>
        {part}
      </span>
    ) : (
      <span key={`${i}-t`}>{part}</span>
    )
  )
}

function renderPromoSlide(slide: PromoSlide, ui: (typeof PROMO_UI)[PromoKind], kind: PromoKind) {
  const headlineId = `hero-promo-${slide.id}-headline`
  const logoSrc = promoBrandLogoSrc(kind)
  return (
    <div className={ui.panel} role="group" aria-labelledby={headlineId}>
      <div className={ui.panelInner}>
        <div className={ui.stack}>
          <div className={`hero-promo-brand-row hero-promo-brand-row--${kind}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-promo-brand-logo" src={logoSrc} alt={ui.brandAlt} />
          </div>
          {slide.eyebrow ? <p className={ui.eyebrow}>{slide.eyebrow}</p> : null}
          <h2 id={headlineId} className={ui.headline}>
            {moneyAccentSpans(slide.headline, ui.moneyAccent)}
          </h2>
          {slide.promoHighlight ? (
            <p className={ui.promoHl}>{moneyAccentSpans(slide.promoHighlight, ui.moneyAccent)}</p>
          ) : null}
          <p className={ui.sub}>
            {moneyAccentSpans(slide.subtext, ui.moneyAccent)}{' '}
            {slide.termsUrl ? (
              <a
                href={slide.termsUrl}
                className={ui.terms}
                target="_blank"
                rel="noopener noreferrer"
              >
                {slide.termsLabel ?? 'View terms'}
              </a>
            ) : null}
          </p>
          {slide.termsUrl ? (
            <p className="hero-mobile-terms-wrap">
              <a href={slide.termsUrl} className={ui.terms} target="_blank" rel="noopener noreferrer">
                {slide.termsLabel ?? 'View terms'}
              </a>
            </p>
          ) : null}
          <a
            href={slide.referralUrl}
            className={ui.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            {slide.ctaText}
          </a>
          {slide.steps && slide.steps.length > 0 ? (
            <>
              <h3 className={ui.stepsTitle}>{slide.stepsTitle ?? 'How it works'}</h3>
              <ol className={ui.steps}>
                {slide.steps.map((step, i) => (
                  <li key={i} className={ui.step}>
                    <span className={ui.stepNum} aria-hidden>
                      {i + 1}
                    </span>
                    <div className={ui.stepBody}>
                      <span className={ui.stepTitle}>{step.title}</span>
                      {step.hint ? <span className={ui.stepHint}>{step.hint}</span> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function HeroSlider({ slides = [] }: { slides?: HeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    align: 'start',
    slidesToScroll: 1,
    containScroll: false
  })
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
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  /* Restart interval whenever the active slide changes (manual or auto) so the 30s window always resets */
  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return
    const interval = setInterval(() => emblaApi.scrollNext(), HERO_AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi, slides.length, selectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    const onResize = () => emblaApi.reInit()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [emblaApi])

  if (slides.length === 0) return null

  const activeKind = slides[selectedIndex]?.kind ?? 'chime'
  const showChrome = slides.length > 1

  return (
    <div className="hero-section" data-active-slide={activeKind}>
      <div className="hero-carousel-shell">
        <div ref={emblaRef} className="hero-embla-viewport">
          <div className="hero-embla-track">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`hero-slide-cell ${slide.kind === 'image' ? 'hero-slide-cell--image' : 'hero-slide-cell--promo'}`}
              >
                <div
                  className={`hero-slide ${
                    slide.kind === 'image'
                      ? 'hero-slide-image'
                      : slide.kind === 'chime'
                        ? 'hero-slide-chime'
                        : slide.kind === 'coinbase'
                          ? 'hero-slide-coinbase'
                          : slide.kind === 'paypal'
                            ? 'hero-slide-paypal'
                            : slide.kind === 'uber'
                              ? 'hero-slide-uber'
                              : 'hero-slide-ubereats'
                  }`}
                >
                  {slide.kind === 'image' ? (
                    <div className="hero-image-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slide.imageUrl} alt="" className="hero-image" />
                    </div>
                  ) : (
                    renderPromoSlide(slide, PROMO_UI[slide.kind], slide.kind)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showChrome ? (
          <>
            <button
              type="button"
              className="hero-floating-arrow hero-floating-arrow--prev"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              className="hero-floating-arrow hero-floating-arrow--next"
              onClick={scrollNext}
              aria-label="Next slide"
            >
              <ChevronRight size={22} strokeWidth={2.25} />
            </button>
            <div className="hero-floating-dots" role="tablist" aria-label="Hero slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === selectedIndex}
                  className={`hero-floating-dot ${i === selectedIndex ? 'active' : ''}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
