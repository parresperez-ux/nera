import data from '@/data/products.json'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  grams: number
  video: string
  poster: string
  photos: string[]
}

export type Catalog = {
  store: { name: string; tagline: string }
  contact: { handle: string; telegram: string; signal: string }
  products: Product[]
}

export const catalog = data as Catalog

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

export function formatPrice(value: number) {
  return euro.format(value)
}

export function formatGrams(value: number) {
  return `${value} g`
}
