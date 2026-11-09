import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatGrams, formatPrice, type Product } from '@/lib/catalog'

type Props = {
  product: Product
  onSelect: () => void
  size?: 'grid' | 'carousel'
  priority?: boolean
}

export function ProductCard({ product, onSelect, size = 'grid', priority }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full flex-col text-left"
      aria-label={`View ${product.name}, ${formatPrice(product.price)}, ${formatGrams(product.grams)}`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-card">
        <img
          src={product.poster || '/placeholder.svg'}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-active:scale-[0.98]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
          <Play className="size-3 fill-white text-white" aria-hidden="true" />
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <span className="text-xs text-white/80">{formatGrams(product.grams)}</span>
          <span className="text-sm font-medium text-white">{formatPrice(product.price)}</span>
        </div>
      </div>
      <h2 className={cn('mt-2.5 truncate font-serif leading-tight', size === 'grid' ? 'text-lg' : 'text-2xl')}>
        {product.name}
      </h2>
    </button>
  )
}
