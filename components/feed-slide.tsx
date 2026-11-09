'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronUp, Play } from 'lucide-react'
import { formatGrams, formatPrice, type Catalog, type Product } from '@/lib/catalog'
import { ContactButtons } from '@/components/contact-panel'

type Props = {
  product: Product
  contact: Catalog['contact']
  isActive: boolean
  isNear: boolean
  muted: boolean
  onAutoplayBlocked: () => void
  showSwipeHint: boolean
}

export function FeedSlide({ product, contact, isActive, isNear, muted, onAutoplayBlocked, showSwipeHint }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)

  const hasVideo = Boolean(product.video) && !videoFailed
  const photos = product.photos.filter(Boolean)
  const mediaCount = 1 + photos.length
  const shouldPlay = isActive && mediaIndex === 0 && !paused

  useEffect(() => {
    const video = videoRef.current
    if (video) video.muted = muted
  }, [muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasVideo) return
    if (!shouldPlay) {
      video.pause()
      if (!isActive) {
        video.currentTime = 0
        setProgress(0)
      }
      return
    }
    video.muted = muted
    video.play().catch(() => {
      video.muted = true
      onAutoplayBlocked()
      video.play().catch(() => setPaused(true))
    })
    // muted intentionally excluded: changing sound must not restart playback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay, isActive, hasVideo, onAutoplayBlocked])

  useEffect(() => {
    if (!isActive) setPaused(false)
  }, [isActive])

  const handleMediaScroll = () => {
    const el = mediaRef.current
    if (!el) return
    setMediaIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <article className="relative h-dvh w-full snap-start snap-always overflow-hidden" aria-label={product.name}>
      <div
        ref={mediaRef}
        onScroll={handleMediaScroll}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
      >
        <div className="relative h-full w-full shrink-0 snap-center">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={isNear ? product.video : undefined}
                poster={product.poster}
                preload={isNear ? 'auto' : 'none'}
                playsInline
                loop
                disablePictureInPicture
                onError={() => setVideoFailed(true)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (v.duration) setProgress(v.currentTime / v.duration)
                }}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play video' : 'Pause video'}
                className="absolute inset-0 flex items-center justify-center"
              >
                {paused && (
                  <span className="flex size-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
                    <Play className="ml-1 size-7 fill-white text-white" aria-hidden="true" />
                  </span>
                )}
              </button>
            </>
          ) : (
            <img src={product.poster || '/placeholder.svg'} alt={product.name} className="size-full object-cover" />
          )}
        </div>

        {photos.map((src, i) => (
          <div key={`${src}-${i}`} className="h-full w-full shrink-0 snap-center">
            <img
              src={src || '/placeholder.svg'}
              alt={`${product.name} photo ${i + 1}`}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-32">
        {mediaCount > 1 && (
          <div className="mb-4 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: mediaCount }).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === mediaIndex ? 'w-5 bg-white' : 'w-1 bg-white/40'}`}
              />
            ))}
          </div>
        )}

        <h2 className="font-serif text-4xl leading-none text-white text-balance">{product.name}</h2>
        <p className="mt-2.5 max-w-sm text-pretty text-sm leading-relaxed text-white/75">{product.description}</p>

        <dl className="mt-4 flex items-center gap-2">
          <div className="rounded-full bg-white px-3.5 py-1.5">
            <dt className="sr-only">Price</dt>
            <dd className="text-sm font-semibold text-black">{formatPrice(product.price)}</dd>
          </div>
          <div className="rounded-full border border-white/25 px-3.5 py-1.5">
            <dt className="sr-only">Weight</dt>
            <dd className="text-sm text-white">{formatGrams(product.grams)}</dd>
          </div>
        </dl>

        <div className="pointer-events-auto mt-5">
          <ContactButtons contact={contact} compact />
          <p className="mt-2.5 text-center text-[11px] text-white/55">
            To order, message {contact.handle} on Telegram or Signal
          </p>
        </div>

        {showSwipeHint && (
          <div className="mt-3 flex flex-col items-center text-white/50" aria-hidden="true">
            <ChevronUp className="size-4 animate-bounce" />
            <span className="text-[10px] uppercase tracking-[0.2em]">Swipe up</span>
          </div>
        )}

        {hasVideo && (
          <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/15" aria-hidden="true">
            <div className="h-full bg-white/80" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
    </article>
  )
}
