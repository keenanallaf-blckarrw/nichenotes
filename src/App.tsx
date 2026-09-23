import { useEffect } from 'react'
import { HashRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './state/store'
import { UIProvider, useUI } from './state/ui'
import { Shell } from './components/Shell'
import { Sheets } from './components/Sheets'
import { Onboarding } from './pages/Onboarding'
import { Feed } from './pages/Feed'
import { Discover, VibePage } from './pages/Discover'
import { Crews, CrewPage } from './pages/Crews'
import { Profile } from './pages/Profile'
import { Brands } from './pages/Brands'

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
  if (!store.onboarded) return <Onboarding />
  return (
    <Shell>
      <ScrollAndSheetReset />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/v/:id" element={<VibePage />} />
        <Route path="/crews" element={<Crews />} />
        <Route path="/crews/:id" element={<CrewPage />} />
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
    <StoreProvider>
      <UIProvider>
        <Router>
          <Routed />
        </Router>
      </UIProvider>
    </StoreProvider>
  )
}
