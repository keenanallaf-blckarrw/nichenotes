import type { ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Compass, Flame, Sparkles, Users, UserRound, X } from 'lucide-react'
import { labelOf, topVibes } from '../engine'
import { useStore } from '../state/store'
import { Logo } from './bits'

const TABS = [
  { to: '/', label: 'For You', icon: Flame, end: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/crews', label: 'Crews', icon: Users },
  { to: '/me', label: 'You', icon: UserRound },
]

/** Live readout of what the feed thinks you're into. Moves as you use the app. */
export function VibeMeter({ compact = false }: { compact?: boolean }) {
  const store = useStore()
  const top = topVibes(store.profile, compact ? 3 : 5)
  if (!top.length) return <span className="font-mono text-[11px] text-ink-3">Reading your vibe…</span>
  return (
    <Link to="/me" className={`flex ${compact ? 'gap-3' : 'flex-col gap-2.5'} min-w-0`} aria-label="Your vibe">
      {top.map((v) => (
        <div key={v.id} className={`min-w-0 ${compact ? 'flex-1' : ''}`}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[11.5px] font-semibold tracking-wide uppercase">{labelOf(v.id)}</span>
            {!compact && <span className="tnum font-mono text-[11px] text-ink-3">{Math.round(v.value * 100)}</span>}
          </div>
          <div className="mt-1 h-[3px] rounded-full bg-accent-soft">
            <div className="meter-fill h-full rounded-full bg-accent" style={{ width: `${Math.max(6, v.value * 100)}%` }} />
          </div>
        </div>
      ))}
    </Link>
  )
}

function Toasts() {
  const store = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(92px+env(safe-area-inset-bottom,0px))] z-40 flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
      {store.toasts.map((t) => (
        <div
          key={t.id}
          className={`anim-rise pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-[14px] px-4 py-3 shadow-lg ${
            t.tone === 'unlock' ? 'border border-gold bg-gold-soft text-ink' : 'bg-ink text-bg'
          }`}
        >
          {t.tone === 'unlock' && <Sparkles size={18} className="mt-0.5 shrink-0 text-gold" />}
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold">{t.title}</div>
            {t.body && <div className="text-[13px] opacity-80">{t.body}</div>}
          </div>
          <button className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss" onClick={() => store.dismissToast(t.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full">
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col gap-8 border-r border-line px-6 py-8 lg:flex">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-1">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-3 py-2.5 text-[15px] font-medium transition-colors ${isActive ? 'bg-ink text-bg' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'}`
              }
            >
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <div className="eyebrow">Your vibe, live</div>
          <VibeMeter />
          <Link to="/brands" className="mt-4 text-[13px] text-ink-3 hover:text-ink">
            For brands →
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[240px]">
        <main className="pb-tabbar mx-auto w-full max-w-[600px] px-4">{children}</main>
      </div>

      {/* Mobile tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/92 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto flex max-w-[600px] justify-around">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${isActive ? 'text-ink' : 'text-ink-3'}`}>
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      <Toasts />
    </div>
  )
}
