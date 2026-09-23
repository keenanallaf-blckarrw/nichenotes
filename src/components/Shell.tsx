import type { ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Compass, Home, Sparkles, UserRound, Users } from 'lucide-react'
import { useStore } from '../state/store'
import { Logo } from './bits'

const TABS = [
  { to: '/', label: 'For You', icon: Home, end: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/clubs', label: 'Clubs', icon: Users },
  { to: '/me', label: 'You', icon: UserRound },
]

function Toasts() {
  const store = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom,0px))] z-40 flex flex-col items-center gap-2 px-4 lg:bottom-8" aria-live="polite">
      {store.toasts.map((t) => (
        <button
          key={t.id}
          className="anim-rise pointer-events-auto flex max-w-[400px] items-center gap-3 rounded-full bg-ink py-2.5 pr-5 pl-4 text-left text-bg shadow-[0_8px_30px_rgb(0_0_0/0.2)]"
          onClick={() => store.dismissToast(t.id)}
          aria-label={`${t.title}. Dismiss`}
        >
          {t.tone === 'unlock' && <Sparkles size={18} className="shrink-0" />}
          <span className="min-w-0">
            <span className="block text-[0.9375rem] font-semibold">{t.title}</span>
            {t.body && <span className="block text-[0.8125rem] opacity-75">{t.body}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full">
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] flex-col gap-8 px-5 py-8 lg:flex">
        <Link to="/" className="px-3">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-0.5">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `flex items-center gap-3 rounded-[10px] px-3 py-2 text-[0.9375rem] font-medium ${isActive ? 'bg-surface text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/brands" className="t-foot mt-auto px-3 text-ink-2 hover:text-ink">
          For brands
        </Link>
      </aside>

      <div className="lg:pl-[232px]">
        <main className="pb-tabbar mx-auto w-full max-w-[600px] px-5">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t-[0.5px] border-line bg-bar backdrop-blur-xl backdrop-saturate-150 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto flex max-w-[600px]">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 pt-2 pb-2.5 text-[0.6562rem] font-medium ${isActive ? 'text-accent-text' : 'text-ink-3'}`}
            >
              <Icon size={24} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <Toasts />
    </div>
  )
}
