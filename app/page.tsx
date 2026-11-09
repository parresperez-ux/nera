import { Storefront } from '@/components/storefront'
import { catalog } from '@/lib/catalog'

export default function Page() {
  return <Storefront catalog={catalog} />
}
