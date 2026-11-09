import { cn } from '@/lib/utils'
import { badgeLabel } from '@/lib/catalog'

const STYLES: Record<string, string> = {
  new: 'bg-white text-black',
  soldout: 'bg-black/60 text-white/80 border border-white/20',
  soon: 'bg-white/10 text-white border border-white/30',
}

export function ProductBadge({ badge, className }: { badge?: string; className?: string }) {
  const label = badgeLabel(badge)
  if (!label) return null
  const style = STYLES[badge!.trim().toLowerCase()] ?? 'bg-white text-black'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] backdrop-blur-md',
        style,
        className,
      )}
    >
      {label}
    </span>
  )
}
