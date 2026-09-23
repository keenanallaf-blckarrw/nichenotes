import { useState } from 'react'
import { Check } from 'lucide-react'
import { VIBES, WORLDS } from '../engine'
import { MENTORS } from '../data/catalog'
import type { MentorId } from '../data/types'
import { useStore } from '../state/store'
import { Logo } from '../components/bits'

/** Two steps, no typing: what you're into, and whose words you want each morning. */
export function Onboarding() {
  const store = useStore()
  const [step, setStep] = useState<'interests' | 'mentor'>('interests')
  const [vibes, setVibes] = useState<string[]>([])
  const [mentor, setMentor] = useState<MentorId | null>(null)

  const sample = () => store.completeOnboarding({ vibes: ['soccer', 'streetwear', 'stoicism', 'skincare'], mentor: 'jobs' })
  const needed = Math.max(0, 3 - vibes.length)

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
          <p className="mt-2 text-ink-2">Choose three or more. Your feed learns the rest as you go.</p>
          <div className="mt-8 flex flex-col gap-7">
            {WORLDS.map((w) => (
              <div key={w.id}>
                <h2 className="t-foot mb-2.5 font-semibold text-ink-2">{w.label}</h2>
                <div className="flex flex-wrap gap-2">
                  {VIBES.filter((v) => v.world === w.id).map((v) => {
                    const on = vibes.includes(v.id)
                    return (
                      <button key={v.id} className="chip" aria-pressed={on} onClick={() => setVibes((cur) => (on ? cur.filter((x) => x !== v.id) : [...cur, v.id]))}>
                        {on && <Check size={15} strokeWidth={2.5} />}
                        {v.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-bg from-60% to-transparent px-5 pt-10 pb-6">
            <button className="btn btn-primary btn-large w-full" disabled={needed > 0} onClick={() => setStep('mentor')}>
              {needed > 0 ? `Choose ${needed} more` : 'Continue'}
            </button>
          </div>
        </section>
      ) : (
        <section className="anim-rise flex flex-1 flex-col">
          <h1 className="t-large mt-12">Who inspires you?</h1>
          <p className="mt-2 text-ink-2">You'll get a quote from them every morning.</p>
          <div className="mt-8 overflow-hidden rounded-[14px] bg-surface">
            {MENTORS.map((m) => {
              const on = mentor === m.id
              return (
                <button
                  key={m.id}
                  className="flex w-full items-center gap-4 border-b-[0.5px] border-line px-4 py-3.5 text-left last:border-b-0"
                  aria-pressed={on}
                  onClick={() => setMentor(m.id)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="t-headline block">{m.name}</span>
                    <span className="t-sub block text-ink-2">{m.line}</span>
                  </span>
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${on ? 'bg-accent text-accent-ink' : 'border-[1.5px] border-line'}`}>
                    {on && <Check size={15} strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-bg from-60% to-transparent px-5 pt-10 pb-6">
            <button className="btn btn-primary btn-large w-full" disabled={!mentor} onClick={() => store.completeOnboarding({ vibes, mentor })}>
              Start
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
