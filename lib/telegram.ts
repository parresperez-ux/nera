type TelegramWebApp = {
  ready: () => void
  expand: () => void
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  disableVerticalSwipes?: () => void
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
  BackButton?: {
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  HapticFeedback?: { selectionChanged: () => void }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export function getTelegram(): TelegramWebApp | undefined {
  if (typeof window === 'undefined') return undefined
  return window.Telegram?.WebApp
}

export function openExternal(url: string) {
  const tg = getTelegram()
  const isTelegramLink = /^https:\/\/t\.me\//.test(url)
  if (tg && isTelegramLink) {
    tg.openTelegramLink(url)
    return
  }
  if (tg) {
    tg.openLink(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function haptic() {
  getTelegram()?.HapticFeedback?.selectionChanged()
}
