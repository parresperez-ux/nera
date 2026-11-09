'use client'

import { useEffect, useState } from 'react'
import type { Catalog } from '@/lib/catalog'
import { getTelegram, haptic } from '@/lib/telegram'
import { CatalogHeader, type ViewMode } from '@/components/catalog-header'
import { CatalogGrid } from '@/components/catalog-grid'
import { CatalogCarousel } from '@/components/catalog-carousel'
import { ContactPanel } from '@/components/contact-panel'
import { VideoFeed } from '@/components/video-feed'

export function Storefront({ catalog }: { catalog: Catalog }) {
  const [mode, setMode] = useState<ViewMode>('grid')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#0a0a0a')
    tg.setBackgroundColor?.('#0a0a0a')
    tg.disableVerticalSwipes?.()
  }, [])

  useEffect(() => {
    const back = getTelegram()?.BackButton
    if (!back) return
    const close = () => setOpenIndex(null)
    if (openIndex !== null) {
      back.show()
      back.onClick(close)
    } else {
      back.hide()
    }
    return () => back.offClick(close)
  }, [openIndex])

  const open = (index: number) => {
    haptic()
    setOpenIndex(index)
  }

  return (
    <main className="mx-auto min-h-dvh max-w-xl pb-10">
      <CatalogHeader
        storeName={catalog.store.name}
        tagline={catalog.store.tagline}
        count={catalog.products.length}
        mode={mode}
        onToggle={() => {
          haptic()
          setMode((m) => (m === 'grid' ? 'carousel' : 'grid'))
        }}
      />

      {mode === 'grid' ? (
        <CatalogGrid products={catalog.products} onSelect={open} />
      ) : (
        <CatalogCarousel products={catalog.products} onSelect={open} />
      )}

      <ContactPanel contact={catalog.contact} className="mx-4 mt-10" />

      {openIndex !== null && (
        <VideoFeed
          products={catalog.products}
          contact={catalog.contact}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </main>
  )
}
