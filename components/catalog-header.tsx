import { GalleryHorizontal, LayoutGrid } from 'lucide-react'

export type ViewMode = 'grid' | 'carousel'

type Props = {
  storeName: string
  tagline: string
  count: number
  mode: ViewMode
  onToggle: () => void
}

export function CatalogHeader({ storeName, tagline, count, mode, onToggle }: Props) {
  const nextLabel = mode === 'grid' ? 'Switch to carousel view' : 'Switch to grid view'

  return (
    <header className="sticky top-0 z-20 bg-background/85 px-4 pb-4 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={nextLabel}
          className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors active:bg-accent"
        >
          {mode === 'grid' ? (
            <GalleryHorizontal className="size-[18px]" aria-hidden="true" />
          ) : (
            <LayoutGrid className="size-[18px]" aria-hidden="true" />
          )}
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-serif text-2xl leading-none tracking-tight">{storeName}</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{tagline}</p>
        </div>

        <span className="flex size-10 items-center justify-center text-xs tabular-nums text-muted-foreground">
          {count}
          <span className="sr-only"> products</span>
        </span>
      </div>
    </header>
  )
}
