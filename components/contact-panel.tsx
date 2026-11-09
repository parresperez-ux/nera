'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildMessage, type Catalog, type Product } from '@/lib/catalog'
import { openExternal } from '@/lib/telegram'

type Props = {
  contact: Catalog['contact']
  className?: string
  compact?: boolean
  product?: Product
}

function withText(url: string, text: string) {
  if (!text) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}text=${encodeURIComponent(text)}`
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  }
}

export function ContactButtons({ contact, compact, product }: Omit<Props, 'className'>) {
  const [copied, setCopied] = useState(false)
  const message = buildMessage(contact, product)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 3500)
    return () => clearTimeout(t)
  }, [copied])

  const base =
    'flex flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-opacity active:opacity-80'
  const height = compact ? 'h-11' : 'h-12'

  const openSignal = async () => {
    if (message) setCopied(await copyText(message))
    openExternal(contact.signal)
  }

  return (
    <div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => openExternal(withText(contact.telegram, message))}
          className={cn(base, height, 'bg-primary text-primary-foreground')}
        >
          <Send className="size-4" aria-hidden="true" />
          Telegram
        </button>
        <button
          type="button"
          onClick={openSignal}
          className={cn(base, height, 'border border-white/20 bg-white/5 text-foreground backdrop-blur-sm')}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Signal
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-0 text-center text-[11px] text-white/70">
        {copied ? 'Message copied. Paste it in Signal to send.' : ''}
      </p>
    </div>
  )
}

export function ContactPanel({ contact, className }: Omit<Props, 'compact' | 'product'>) {
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
