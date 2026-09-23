import { useState } from 'react'
import { Check, Search } from 'lucide-react'
import { VIBES, WORLDS } from '../engine'
import { QUOTE_THEMES } from '../data/catalog'
import type { QuoteTheme } from '../data/types'
import { useStore } from '../state/store'
import { Logo } from '../components/bits'

/** Two steps, no typing required: what you're into, and whose words you want each morning. */
export function Onboarding() {
  const store = useStore()
  const [step, setStep] = useState<'interests' | 'themes'>('interests')
  const [vibes, setVibes] = useState<string[]>([])
  const [themes, setThemes] = useState<QuoteTheme[]>([])
  const [query, setQuery] = useState('')

  const sample = () => store.completeOnboarding({ vibes: ['soccer', 'streetwear', 'philosophy', 'skincare', 'coffee', 'travel'], themes: [] })
  const needed = Math.max(0, 3 - vibes.length)
  const q = query.trim().toLowerCase()
  const matches = (label: string, blurb: string) => !q || label.toLowerCase().includes(q) || blurb.toLowerCase().includes(q)

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[600px] flex-col px-5">
      <header className="flex items-center justify-between pt-5">
        <Logo />
        {step === 'interests' ? (
          <button className="t-sub font-medium text-accent-text" onClick={sample}>
            Skip
          </button>
        ) : (
          <button className="t-sub font-medium text-accent-text" onClick={() => setStep('interests')}>
            Back
          </button>
        )}
      </header>

      {step === 'interests' ? (
        <section className="anim-rise flex flex-1 flex-col">
          <h1 className="t-large mt-12">What are you into?</h1>
          <p className="mt-2 text-ink-2">Choose three or more. Your feed learns the rest as you go, and you can change this any time.</p>
          <label htmlFor="interest-search" className="mt-6 flex items-center gap-2 rounded-[12px] bg-surface px-3 py-2.5">
            <Search size={18} className="shrink-0 text-ink-3" />
            <span className="sr-only">Find an interest</span>
            <input
              id="interest-search"
              className="w-full bg-transparent outline-none placeholder:text-ink-3"
              placeholder="Find an interest"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="mt-7 flex flex-col gap-7">
            {WORLDS.map((w) => {
              const options = VIBES.filter((v) => v.world === w.id && matches(v.label, v.blurb))
              if (!options.length) return null
              return (
                <div key={w.id} role="group" aria-labelledby={`world-${w.id}`}>
                  <h2 id={`world-${w.id}`} className="t-foot mb-2.5 font-semibold text-ink-2">
                    {w.label}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {options.map((v) => {
                      const on = vibes.includes(v.id)
                      return (
                        <button key={v.id} className="chip" aria-pressed={on} onClick={() => setVibes((cur) => (on ? cur.filter((x) => x !== v.id) : [...cur, v.id]))}>
                          {on && <Check size={15} strokeWidth={2.5} aria-hidden="true" />}
                          {v.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {q && !VIBES.some((v) => matches(v.label, v.blurb)) && (
              <p className="text-ink-2">No match yet. Pick something close, and suggest what is missing from Discover later.</p>
            )}
          </div>
          <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-bg from-60% to-transparent px-5 pt-10 pb-6">
            <button className="btn btn-primary btn-large w-full" disabled={needed > 0} onClick={() => setStep('themes')}>
              {needed > 0 ? `Choose ${needed} more` : `Continue with ${vibes.length}`}
            </button>
          </div>
        </section>
      ) : (
        <section className="anim-rise flex flex-1 flex-col">
          <h1 className="t-large mt-12">Whose words inspire you?</h1>
          <p className="mt-2 text-ink-2">You'll get one quote each morning. Choose as many as you like, or none for a mix of everything.</p>
          <div className="mt-8 overflow-hidden rounded-[14px] bg-surface">
            {QUOTE_THEMES.map((t) => {
              const on = themes.includes(t.id)
              return (
                <button
                  key={t.id}
                  className="flex w-full items-center gap-4 border-b-[0.5px] border-line px-4 py-3.5 text-left last:border-b-0"
                  aria-pressed={on}
                  onClick={() => setThemes((cur) => (on ? cur.filter((x) => x !== t.id) : [...cur, t.id]))}
                >
                  <span className="min-w-0 flex-1">
                    <span className="t-headline block">{t.name}</span>
                    <span className="t-sub block text-ink-2">{t.people}</span>
                  </span>
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${on ? 'bg-accent text-accent-ink' : 'border-[1.5px] border-line'}`} aria-hidden="true">
                    {on && <Check size={15} strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-bg from-60% to-transparent px-5 pt-10 pb-6">
            <button className="btn btn-primary btn-large w-full" onClick={() => store.completeOnboarding({ vibes, themes })}>
              {themes.length ? 'Start' : 'Start with a mix'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
