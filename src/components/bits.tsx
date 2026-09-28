import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Logo() {
  return <span className="text-[1.3125rem] font-semibold tracking-[-0.02em]">NicheNotes</span>
}

export function Avatar({ name, size = 36, square = false }: { name: string; size?: number; square?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-surface-2 font-semibold text-ink-2 ${square ? 'rounded-[12px]' : 'rounded-full'}`}
      style={{ width: size, height: size, fontSize: `${(size * 0.42) / 16}rem` }}
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
  const cents = Number.isInteger(n) ? 0 : 2
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: cents, maximumFractionDigits: cents })}`
}

/** "$64", or "From $142" when there are several sizes or options. */
export function price(item: { price: number; priceFrom?: boolean }): string {
  return `${item.priceFrom ? 'From ' : ''}${money(item.price)}`
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

export function Segmented<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="mt-4" role="radiogroup" aria-label={label}>
      <p className="t-foot mb-2 font-semibold text-ink-2">{label}</p>
      <div className="flex rounded-[12px] bg-surface p-1">
        {options.map(([v, name]) => (
          <button
            key={String(v)}
            role="radio"
            aria-checked={value === v}
            className={`min-h-[44px] flex-1 rounded-[9px] text-[0.9375rem] font-medium ${value === v ? 'bg-bg text-ink shadow-[0_1px_4px_rgb(0_0_0/0.12)]' : 'text-ink-2'}`}
            onClick={() => onChange(v)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

/** "Today · 6:30 PM", "Tomorrow · 9:00 AM", "Sat, Sep 27 · 10:00 AM" in the viewer's own locale. */
export function eventTime(ts: number): string {
  const d = new Date(ts)
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${dayLabel(ts, 'short')} · ${time}`
}

export function dayLabel(ts: number, style: 'short' | 'long' = 'long'): string {
  const d = new Date(ts)
  const today = new Date()
  const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday: style, month: 'short', day: 'numeric' })
}

/** Calendar-style date tile for events. */
export function DateTile({ ts }: { ts: number }) {
  const d = new Date(ts)
  return (
    <span className="flex w-12 shrink-0 flex-col items-center rounded-[12px] bg-bg py-1.5" aria-hidden="true">
      <span className="text-[0.6875rem] font-semibold text-danger">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
      <span className="text-[1.375rem] leading-none font-semibold">{d.getDate()}</span>
    </span>
  )
}
