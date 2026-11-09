'use client'

import { useRef, useState } from 'react'
import type { Product } from '@/lib/catalog'
import { ProductCard } from '@/components/product-card'

export function CatalogCarousel({ products, onSelect }: { products: Product[]; onSelect: (i: number) => void }) {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLUListElement>(null)

  const handleScroll = () => {
    const track = trackRef.current
    if (!track || !track.firstElementChild) return
    const itemWidth = (track.firstElementChild as HTMLElement).offsetWidth + 16
    setActive(Math.round(track.scrollLeft / itemWidth))
  }

  return (
    <section aria-label="Products carousel" className="pt-2">
      <ul
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[12%] px-[12%]"
      >
        {products.map((product, i) => (
          <li key={product.id} className="w-[76%] shrink-0 snap-center">
            <ProductCard product={product} size="carousel" onSelect={() => onSelect(i)} priority={i < 2} />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
        {products.map((p, i) => (
          <span
            key={p.id}
            className={`h-1 rounded-full transition-all ${i === active ? 'w-5 bg-foreground' : 'w-1 bg-foreground/25'}`}
          />
        ))}
      </div>
    </section>
  )
}
