import type { Product } from '@/lib/catalog'
import { ProductCard } from '@/components/product-card'

export function CatalogGrid({ products, onSelect }: { products: Product[]; onSelect: (i: number) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 pt-2">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} onSelect={() => onSelect(i)} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}
