import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Logo() {
  return <span className="text-[1.3125rem] font-semibold tracking-[-0.02em]">NicheNotes</span>
}

export function Avatar({ name, size = 36, square = false }: { name: string; size?: number; square?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-surface-2 font-semibold text-ink-2 ${square ? 'rounded-[12px]' : 'rounded-full'}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {name.replace(/[^a-z]/gi, '').slice(0, 1).toUpperCase() || '?'}
    </span>
  )
}

/** Large title at the top of a screen, like the system apps. */
export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4 pt-10 pb-2 lg:pt-12">
      <div className="min-w-0">
        {subtitle && <p className="t-foot font-semibold text-ink-2">{subtitle}</p>}
        <h1 className="t-large">{title}</h1>
      </div>
      {action}
    </header>
  )
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="t-title2">{title}</h2>
      {action}
    </div>
  )
}

export function Sheet({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center" role="dialog" aria-modal="true" aria-label={label}>
      <button className="anim-fade absolute inset-0 bg-scrim" aria-label="Close" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className="anim-sheet relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[20px] bg-bg outline-none lg:rounded-[20px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="sticky top-0 z-10 flex h-12 items-center justify-center bg-bg/85 backdrop-blur-xl">
          <span className="h-[5px] w-9 rounded-full bg-line lg:hidden" />
          <button className="absolute top-2.5 right-3 flex size-8 items-center justify-center rounded-full bg-surface text-ink-2" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

export function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n)
}

export function timeAgo(ts: number): string {
  const m = Math.round((Date.now() - ts) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.round(h / 24)}d`
}
