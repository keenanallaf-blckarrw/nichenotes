import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { VIBES, WORLDS, type Tags } from '../engine'
import { MENTORS } from '../data/catalog'
import type { MentorId } from '../data/types'
import { useStore } from '../state/store'
import { Logo } from '../components/bits'

// Quick "this or that" taps: fast, fun, and each side teaches the engine something.
const PAIRS: { a: string; b: string; ta: Tags; tb: Tags }[] = [
  { a: 'Terrace', b: 'Tailor', ta: { soccer: 1, streetwear: 0.6 }, tb: { tailoring: 1, watches: 0.5 } },
  { a: 'Cold plunge', b: 'Sauna', ta: { recovery: 1, discipline: 0.6 }, tb: { recovery: 1, skincare: 0.4 } },
  { a: 'Vinyl', b: 'Playlist', ta: { vinyl: 1, vintage: 0.4 }, tb: { running: 0.4, lifting: 0.3 } },
  { a: 'Trail', b: 'Track', ta: { trail: 1, travel: 0.4 }, tb: { running: 1, lifting: 0.4 } },
  { a: 'Cologne', b: 'Clean skin', ta: { fragrance: 1, grooming: 0.4 }, tb: { skincare: 1, grooming: 0.5 } },
  { a: 'Deadstock', b: 'Brand new', ta: { vintage: 1, streetwear: 0.4 }, tb: { sneakers: 1, streetwear: 0.6 } },
]

const STEPS = ['vibes', 'pairs', 'mentor', 'reading'] as const

export function Onboarding() {
  const store = useStore()
  const [step, setStep] = useState<(typeof STEPS)[number]>('vibes')
  const [handle, setHandle] = useState('')
  const [vibes, setVibes] = useState<string[]>([])
  const [picks, setPicks] = useState<Record<number, 'a' | 'b'>>({})
  const [mentor, setMentor] = useState<MentorId | null>(null)

  const finish = () => {
    setStep('reading')
    const pairs = Object.entries(picks).map(([i, side]) => (side === 'a' ? PAIRS[+i].ta : PAIRS[+i].tb))
    setTimeout(() => store.completeOnboarding({ handle, vibes, pairs, mentor }), 1600)
  }

  const sample = () => store.completeOnboarding({ handle: 'sample_guy', vibes: ['soccer', 'streetwear', 'stoicism'], pairs: [PAIRS[0].ta, PAIRS[4].tb], mentor: 'marcus' })

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[640px] flex-col px-4 pt-8 pb-10">
      <header className="flex items-center justify-between">
        <Logo />
        <div className="flex gap-1.5" aria-label={`Step ${STEPS.indexOf(step) + 1} of 3`}>
          {STEPS.slice(0, 3).map((s, i) => (
            <span key={s} className={`h-1 w-7 rounded-full ${i <= STEPS.indexOf(step) ? 'bg-ink' : 'bg-line'}`} />
          ))}
        </div>
      </header>

      {step === 'vibes' && (
        <section className="anim-rise mt-10 flex flex-col gap-6">
          <div>
            <div className="eyebrow">Vibe check · 1 of 3</div>
            <h1 className="display mt-2 text-[56px] sm:text-[72px]">What are you into?</h1>
            <p className="mt-2 max-w-[46ch] text-[16px] text-ink-2">
              Pick at least three. This is just a starting point: the feed learns from what you like, save, skip and shop.
            </p>
          </div>
          {WORLDS.map((w) => (
            <div key={w.id}>
              <div className="mb-2 flex items-baseline gap-2">
                <h2 className="shrink-0 text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase">{w.label}</h2>
                <span className="text-[13px] text-ink-3">{w.blurb}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIBES.filter((v) => v.world === w.id).map((v) => {
                  const on = vibes.includes(v.id)
                  return (
                    <button
                      key={v.id}
                      className="chip !px-3.5 !py-2 !text-[14px]"
                      aria-pressed={on}
                      onClick={() => setVibes((cur) => (on ? cur.filter((x) => x !== v.id) : [...cur, v.id]))}
                    >
                      {on && <Check size={14} />} {v.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          <label className="mt-2 flex flex-col gap-1.5 text-[13px] font-medium" htmlFor="handle">
            Pick a handle <span className="font-normal text-ink-3">(optional)</span>
            <input
              id="handle"
              className="max-w-xs rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[15px] font-normal"
              placeholder="@yourname"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, '').slice(0, 20))}
            />
          </label>
          <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 bg-gradient-to-t from-bg from-70% to-transparent px-4 pt-6 pb-4">
            <button className="btn btn-accent !px-6 !py-3" disabled={vibes.length < 3} onClick={() => setStep('pairs')}>
              Next <ArrowRight size={16} />
            </button>
            <button className="text-[14px] text-ink-2 underline underline-offset-4 hover:text-ink" onClick={sample}>
              Skip, show me a sample profile
            </button>
          </div>
        </section>
      )}

      {step === 'pairs' && (
        <section className="anim-rise mt-10 flex flex-col gap-6">
          <div>
            <div className="eyebrow">Vibe check · 2 of 3</div>
            <h1 className="display mt-2 text-[56px] sm:text-[72px]">This or that</h1>
            <p className="mt-2 text-[16px] text-ink-2">Go with your gut. Skip any you don't care about.</p>
          </div>
          <div className="flex flex-col gap-3">
            {PAIRS.map((p, i) => (
              <div key={p.a} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {(['a', 'b'] as const).map((side, j) => (
                  <button
                    key={side}
                    style={{ order: j * 2 }}
                    className={`display rounded-[12px] border px-3 py-4 text-[26px] transition-colors ${
                      picks[i] === side ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-ink hover:border-ink-3'
                    }`}
                    aria-pressed={picks[i] === side}
                    onClick={() => setPicks((cur) => ({ ...cur, [i]: side }))}
                  >
                    {side === 'a' ? p.a : p.b}
                  </button>
                ))}
                <span className="font-mono text-[11px] text-ink-3" style={{ order: 1 }}>
                  or
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost !py-3" onClick={() => setStep('vibes')}>
              Back
            </button>
            <button className="btn btn-accent !px-6 !py-3" onClick={() => setStep('mentor')}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {step === 'mentor' && (
        <section className="anim-rise mt-10 flex flex-col gap-6">
          <div>
            <div className="eyebrow">Vibe check · 3 of 3</div>
            <h1 className="display mt-2 text-[56px] sm:text-[72px]">Pick your corner man</h1>
            <p className="mt-2 text-[16px] text-ink-2">Whose words start your day? You'll get a line from them every morning.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {MENTORS.map((m) => (
              <button
                key={m.id}
                className={`slab px-5 py-5 text-left transition-transform active:scale-[0.99] ${mentor === m.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}`}
                aria-pressed={mentor === m.id}
                onClick={() => setMentor(m.id)}
              >
                <span className="relative z-[1] block">
                  <span className="block font-serif text-[28px] leading-tight font-semibold">{m.name}</span>
                  <span className="mt-1 block font-serif text-[17px] text-slab-ink-2 italic">{m.line}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost !py-3" onClick={() => setStep('pairs')}>
              Back
            </button>
            <button className="btn btn-accent !px-6 !py-3" onClick={finish}>
              Build my feed <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {step === 'reading' && <Reading />}
    </div>
  )
}

function Reading() {
  const lines = ['Reading your vibe', 'Crossing interests', 'Digging for unknown finds', 'Pulling words worth keeping']
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, lines.length - 1)), 380)
    return () => clearInterval(t)
  }, [lines.length])
  return (
    <section className="flex flex-1 flex-col items-start justify-center gap-3 py-24">
      {lines.slice(0, i + 1).map((l, n) => (
        <div key={l} className={`display anim-rise text-[40px] ${n === i ? 'text-ink' : 'text-ink-3'}`}>
          {l}
          {n === i && <span className="anim-shimmer">…</span>}
        </div>
      ))}
    </section>
  )
}
