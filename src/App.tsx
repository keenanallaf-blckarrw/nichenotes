import { useEffect } from 'react'
import { HashRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './state/store'
import { UIProvider, useUI } from './state/ui'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Shell } from './components/Shell'
import { Sheets } from './components/Sheets'
import { Onboarding } from './pages/Onboarding'
import { Feed } from './pages/Feed'
import { Discover, InterestPage } from './pages/Discover'
import { Clubs, ClubPage } from './pages/Clubs'
import { Nearby } from './pages/Nearby'
import { Profile } from './pages/Profile'
import { Brands } from './pages/Brands'

// A host page may already set a theme; "Automatic" hands control back to it.
const HOST_THEME = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null

/** Applies the person's appearance and text size choices to the whole page. */
function DisplaySettings() {
  const { settings } = useStore()
  useEffect(() => {
    const root = document.documentElement
    const theme = settings.appearance === 'auto' ? HOST_THEME : settings.appearance
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
    root.style.fontSize = `${settings.textSize * 100}%`
    // Match the phone's status bar to the chosen appearance, not just the device's.
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      meta.dataset.media ??= meta.media
      meta.dataset.color ??= meta.content
      if (theme && bg) {
        meta.media = ''
        meta.content = bg
      } else {
        meta.media = meta.dataset.media
        meta.content = meta.dataset.color
      }
    }
  }, [settings.appearance, settings.textSize])
  return null
}

// The single-file build runs inside sandboxed frames that don't own the URL,
// so it keeps routes in memory. Everywhere else, hash routes work on any static host.
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : HashRouter

function ScrollAndSheetReset() {
  const { pathname } = useLocation()
  const ui = useUI()
  useEffect(() => {
    window.scrollTo(0, 0)
    ui.close()
  }, [pathname, ui.close])
  return null
}

function Routed() {
  const store = useStore()
  if (!store.onboarded)
    return (
      <>
        <DisplaySettings />
        <Onboarding />
      </>
    )
  return (
    <Shell>
      <DisplaySettings />
      <ScrollAndSheetReset />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/i/:id" element={<InterestPage />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/:id" element={<ClubPage />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="*" element={<Feed />} />
      </Routes>
      <Sheets />
    </Shell>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <UIProvider>
          <Router>
            <Routed />
          </Router>
        </UIProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
