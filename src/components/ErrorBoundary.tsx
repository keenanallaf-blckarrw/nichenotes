import { Component, type ReactNode } from 'react'
import * as storage from '../state/storage'

/**
 * If anything throws while rendering, show a calm way out instead of a blank page.
 * "Start over" clears saved data, which also recovers from a corrupted save.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('NicheNotes crashed:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto flex min-h-dvh max-w-[400px] flex-col items-center justify-center px-5 text-center">
        <h1 className="t-title">Something went wrong.</h1>
        <p className="mt-2 text-ink-2">Reloading usually fixes it. If it keeps happening, start over. Your display settings will reset too.</p>
        <button className="btn btn-primary btn-large mt-7 w-full" onClick={() => location.reload()}>
          Reload
        </button>
        <button
          className="btn btn-secondary btn-large mt-2 w-full"
          onClick={() => {
            storage.clear()
            location.reload()
          }}
        >
          Start over
        </button>
      </main>
    )
  }
}
