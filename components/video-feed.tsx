'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'
import type { Catalog, Product } from '@/lib/catalog'
import { haptic } from '@/lib/telegram'
import { FeedSlide } from '@/components/feed-slide'

type Props = {
  products: Product[]
  contact: Catalog['contact']
  startIndex: number
  onClose: () => void
}

export function VideoFeed({ products, contact, startIndex, onClose }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(startIndex)
  const [muted, setMuted] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = startIndex * el.clientHeight
  }, [startIndex])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const next = Math.round(el.scrollTop / el.clientHeight)
    if (next !== active) {
      haptic()
      setActive(next)
    }
  }

  const handleAutoplayBlocked = useCallback(() => {
    setMuted(true)
    setSoundBlocked(true)
  }, [])

  const toggleSound = () => {
    setMuted((m) => !m)
    setSoundBlocked(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product videos"
      className="fixed inset-0 z-50 bg-black animate-in fade-in duration-200"
    >
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-scroll overscroll-contain"
      >
        {products.map((product, i) => (
          <FeedSlide
            key={product.id}
            product={product}
            contact={contact}
            isActive={i === active}
            isNear={Math.abs(i - active) <= 1}
            muted={muted}
            onAutoplayBlocked={handleAutoplayBlocked}
            showSwipeHint={i === active && i < products.length - 1}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close and return to catalog"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <span className="rounded-full bg-black/40 px-3 py-1 text-xs tabular-nums text-white/80 backdrop-blur-md">
          {active + 1} / {products.length}
        </span>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Turn sound on' : 'Mute sound'}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          {muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {soundBlocked && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute left-1/2 top-[calc(max(env(safe-area-inset-top),1rem)+3.5rem)] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          <Volume2 className="size-4" aria-hidden="true" />
          Tap for sound
        </button>
      )}

      <span className="sr-only" aria-live="polite">
        {products[active]?.name}
      </span>
    </div>
  )
}
