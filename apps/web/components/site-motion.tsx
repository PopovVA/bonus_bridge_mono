'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { countUpValue, magneticOffset, pointInBox, velocitySkew } from '@/lib/motion-math'

/* Everything here is progressive enhancement: the server HTML is complete and visible without it. */

const SPOTLIGHT_SELECTOR = [
  '.monthly-offer-card',
  '.clip-coupon-card',
  '.hot-cashback-card',
  '.category-store-card',
  '.article-index__link',
  '.store-card',
  '.how-step',
  '.promo-panel',
  '.store-related-card'
].join(',')

const REVEAL_SELECTOR = '.section-head, [data-reveal], .article-page__section, .article-page__disclaimer'

const STAGGER_SELECTOR = [
  '.monthly-offers-grid',
  '.clip-coupons-grid',
  '.hot-cashback-grid',
  '.category-stores-list',
  '.article-index__list',
  '.how-steps',
  '.store-related-offers-card-grid',
  '.store-related-panel-grid'
].join(',')

type Gsap = typeof import('gsap').gsap
type LenisInstance = import('lenis').default

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function finePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/** Pointer effects: spotlight glow on cards, magnetic pull on [data-magnetic]. No library needed. */
function bindPointerEffects(): () => void {
  if (!finePointer()) return () => {}
  const reduced = prefersReducedMotion()
  let magnet: HTMLElement | null = null

  const release = () => {
    if (!magnet) return
    magnet.style.setProperty('--mag-x', '0px')
    magnet.style.setProperty('--mag-y', '0px')
    magnet = null
  }

  const onMove = (e: PointerEvent) => {
    const target = e.target as Element | null
    if (!target?.closest) return
    const card = target.closest<HTMLElement>(SPOTLIGHT_SELECTOR)
    if (card) {
      const p = pointInBox(e.clientX, e.clientY, card.getBoundingClientRect())
      card.style.setProperty('--mx', `${p.x}px`)
      card.style.setProperty('--my', `${p.y}px`)
    }
    if (reduced) return
    const next = target.closest<HTMLElement>('[data-magnetic]')
    if (next !== magnet) release()
    if (!next) return
    magnet = next
    const off = magneticOffset(e.clientX, e.clientY, next.getBoundingClientRect())
    next.style.setProperty('--mag-x', `${off.x}px`)
    next.style.setProperty('--mag-y', `${off.y}px`)
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', release)
  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerleave', release)
    release()
  }
}

/** Header shadow once scrolled; hides on fast scroll down, returns on scroll up. */
function bindHeaderState(): () => void {
  const root = document.documentElement
  let lastY = window.scrollY
  const onScroll = () => {
    const y = window.scrollY
    root.classList.toggle('is-scrolled', y > 8)
    const goingDown = y > lastY + 4
    const goingUp = y < lastY - 4
    if (goingDown && y > 240) root.classList.add('header-tucked')
    if (goingUp || y < 240) root.classList.remove('header-tucked')
    lastY = y
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}

function belowFold(el: Element) {
  return el.getBoundingClientRect().top > window.innerHeight * 0.92
}

function runCountUp(gsap: Gsap, el: HTMLElement) {
  const target = Number(el.dataset.count)
  if (!Number.isFinite(target)) return
  const state = { p: 0 }
  gsap.to(state, {
    p: 1,
    duration: 1.6,
    ease: 'none',
    delay: Number(el.dataset.countDelay ?? 0),
    /* Reset only when the tween really starts, so a stalled ticker never leaves a 0 on screen */
    onStart: () => {
      el.textContent = '0'
    },
    onUpdate: () => {
      el.textContent = String(countUpValue(target, state.p))
    },
    onComplete: () => {
      el.textContent = String(target)
    }
  })
}

/** Scroll-driven choreography. Only elements still below the fold get an entrance, so nothing visible blinks. */
function buildScrollScenes(gsap: Gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger) {
  document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
    if (!belowFold(el) || el.closest(STAGGER_SELECTOR)) return
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })

  document.querySelectorAll<HTMLElement>(STAGGER_SELECTOR).forEach((group) => {
    const items = Array.from(group.children).filter(belowFold)
    if (items.length === 0) return
    gsap.from(items, {
      y: 64,
      autoAlpha: 0,
      rotate: 0.6,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true }
    })
  })

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    if (!belowFold(el)) {
      runCountUp(gsap, el)
      return
    }
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => runCountUp(gsap, el) })
  })

  const hero = document.querySelector('.hero')
  if (hero) {
    gsap.to('.hero__art', {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    })
    /* Wide screens only: on phones the copy fills the hero, so fading it would hide text still being read */
    if (window.matchMedia('(min-width: 861px)').matches) {
      gsap.to('.hero__inner', {
        yPercent: -8,
        autoAlpha: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true }
      })
    }
  }

  document.querySelectorAll<HTMLElement>('.how').forEach((how) => {
    gsap.fromTo(
      how.querySelectorAll('.how__line-fill'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: how, start: 'top 70%', end: 'bottom 60%', scrub: true } }
    )
  })

  const marquee = document.querySelector<HTMLElement>('.category-marquee-viewport')
  if (marquee) {
    const setSkew = gsap.quickTo(marquee, 'skewX', { duration: 0.5, ease: 'power3.out' })
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => setSkew(velocitySkew(self.getVelocity())),
      onLeave: () => setSkew(0),
      onLeaveBack: () => setSkew(0)
    })
  }

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      yPercent: Number(el.dataset.parallax) || -12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    })
  })
}

export function SiteMotion() {
  const pathname = usePathname()
  const lenisRef = useRef<LenisInstance | null>(null)

  useEffect(() => bindPointerEffects(), [])
  useEffect(() => bindHeaderState(), [])

  /* Smooth scrolling (desktop pointer only), stopped while a modal locks body scroll. */
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return
    let cancelled = false
    let observer: MutationObserver | null = null
    let detachTicker: (() => void) | null = null
    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ anchors: { offset: -88 }, lerp: 0.12, allowNestedScroll: true })
        lenisRef.current = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        detachTicker = () => gsap.ticker.remove(tick)
        observer = new MutationObserver(() => {
          if (document.body.style.overflow === 'hidden') lenis.stop()
          else lenis.start()
        })
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
      }
    )
    return () => {
      cancelled = true
      observer?.disconnect()
      detachTicker?.()
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  /* Rebuild scroll scenes for each page. */
  useEffect(() => {
    if (prefersReducedMotion()) return
    let cancelled = false
    let revert: (() => void) | null = null
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      /* Time-based, not frame-based: a throttled tab still finishes its tweens on schedule */
      gsap.ticker.lagSmoothing(0)
      document.documentElement.classList.add('motion-ready')
      const ctx = gsap.context(() => buildScrollScenes(gsap, ScrollTrigger))
      requestAnimationFrame(() => ScrollTrigger.refresh())
      revert = () => ctx.revert()
    })
    return () => {
      cancelled = true
      revert?.()
    }
  }, [pathname])

  return null
}
