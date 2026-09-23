import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`display inline-flex items-baseline ${size === 'lg' ? 'text-5xl' : 'text-[26px]'}`} aria-label="NicheNotes">
      <span className="mr-[0.14em]">Niche</span>
      <span className="text-accent">N°</span>
      <span className="-ml-[0.06em]">tes</span>
    </span>
  )
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  // Deterministic kit colours from the handle, so everyone gets a consistent badge.
  const palette = ['#1f6b3a', '#2143c4', '#7e1f2b', '#3a2f6b', '#a87a12', '#0f5c4d', '#5b3a29', '#1c2b4f']
  const h = [...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const bg = palette[h % palette.length]
  return (
    <span
      className="display inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.46 }}
      aria-hidden="true"
    >
      {name.replace(/[^a-z]/gi, '').slice(0, 1).toUpperCase() || '?'}
    </span>
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
      <button className="anim-fade absolute inset-0 bg-black/45" aria-label="Close" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className="anim-sheet relative max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-t-[22px] bg-bg outline-none lg:rounded-[22px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="sticky top-0 z-10 flex justify-between bg-bg/90 px-4 pt-3 pb-1 backdrop-blur">
          <span className="mx-auto h-1 w-10 rounded-full bg-line lg:hidden" />
          <button className="icon-btn absolute top-2 right-2" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="px-4 pb-6 sm:px-6">{children}</div>
      </div>
    </div>
  )
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h2 className="display text-[28px]">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

export function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)
}

export function timeAgo(ts: number): string {
  const m = Math.round((Date.now() - ts) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.round(h / 24)}d`
}
