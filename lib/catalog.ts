import data from '@/data/products.json'

export type Product = {
  id: string
  name: string
  badge?: string
  description: string
  price: number
  grams: number
  video: string
  poster: string
  photos: string[]
}

export type Catalog = {
  store: { name: string; tagline: string }
  contact: {
    handle: string
    telegram: string
    signal: string
    message?: string
    generalMessage?: string
  }
  products: Product[]
}

export const catalog = data as Catalog

const BADGE_LABELS: Record<string, string> = {
  new: 'New',
  soldout: 'Sold out',
  soon: 'Coming soon',
}

export function badgeLabel(badge?: string) {
  const key = badge?.trim().toLowerCase()
  if (!key) return null
  return BADGE_LABELS[key] ?? badge!.trim()
}

export function isUnavailable(product: Product) {
  const key = product.badge?.trim().toLowerCase()
  return key === 'soldout' || key === 'soon'
}

export function buildMessage(contact: Catalog['contact'], product?: Product) {
  if (!product) return contact.generalMessage ?? ''
  return (contact.message ?? '')
    .replaceAll('{product}', product.name)
    .replaceAll('{grams}', formatGrams(product.grams))
    .replaceAll('{price}', formatPrice(product.price))
}

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

export function formatPrice(value: number) {
  return euro.format(value)
}

export function formatGrams(value: number) {
  return `${value} g`
}
