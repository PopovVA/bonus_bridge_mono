'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type HeroImage = {
  id: string
  imageUrl: string
}

export function HeroSlider({ images = [] }: { images?: HeroImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 })
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
    if (!emblaApi || images.length <= 1) return
    const interval = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(interval)
  }, [emblaApi, images.length])

  if (images.length === 0) return null

  return (
    <div className="hero-section">
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {images.map((img) => (
            <div key={img.id} style={{ flex: '0 0 100%', minWidth: 0 }}>
              <div className="hero-slide hero-slide-image">
                <button
                  type="button"
                  className="hero-arrow hero-arrow-prev"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="hero-arrow hero-arrow-next"
                  onClick={scrollNext}
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="hero-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt="" className="hero-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="hero-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot ${i === selectedIndex ? 'active' : ''}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
