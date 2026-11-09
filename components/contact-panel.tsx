'use client'

import { MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Catalog } from '@/lib/catalog'
import { openExternal } from '@/lib/telegram'

type Props = {
  contact: Catalog['contact']
  className?: string
  compact?: boolean
}

export function ContactButtons({ contact, compact }: Omit<Props, 'className'>) {
  const base =
    'flex flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-opacity active:opacity-80'
  const height = compact ? 'h-11' : 'h-12'

  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        onClick={() => openExternal(contact.telegram)}
        className={cn(base, height, 'bg-primary text-primary-foreground')}
      >
        <Send className="size-4" aria-hidden="true" />
        Telegram
      </button>
      <button
        type="button"
        onClick={() => openExternal(contact.signal)}
        className={cn(base, height, 'border border-white/20 bg-white/5 text-foreground backdrop-blur-sm')}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Signal
      </button>
    </div>
  )
}

export function ContactPanel({ contact, className }: Props) {
  return (
    <section aria-labelledby="order-title" className={cn('rounded-2xl border border-border bg-card p-5', className)}>
      <h2 id="order-title" className="font-serif text-2xl">
        How to order
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        Purchases are not available on this page. To order, send us a message on Telegram or Signal at{' '}
        <span className="text-foreground">{contact.handle}</span>.
      </p>
      <div className="mt-5">
        <ContactButtons contact={contact} />
      </div>
    </section>
  )
}
