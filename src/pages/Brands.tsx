import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { PARTNER_MIN_RELEVANCE } from '../engine'
import { SectionTitle } from '../components/bits'

// Illustrative numbers for a sample partner, to show what a brand would see.
const SAMPLE = {
  shop: 'Terrace Archive',
  period: 'Last 30 days',
  tiles: [
    { label: 'Matched impressions', value: '48.2K', delta: '+18% vs prior 30 days' },
    { label: 'Click-outs to your store', value: '3,914', delta: '+24% vs prior 30 days' },
    { label: 'Click-out rate', value: '8.1%', delta: 'Feed average 2.3%' },
    { label: 'Attributed sales', value: '$11.6K', delta: '171 orders' },
  ],
  vibes: [
    { label: 'Blokecore', share: 0.46 },
    { label: 'Football', share: 0.27 },
    { label: 'Vintage', share: 0.14 },
    { label: 'Groundhopper', share: 0.08 },
    { label: 'Streetwear', share: 0.05 },
  ],
}

const STEPS = [
  { title: 'List your products', body: 'Connect your store or upload a feed. We tag every product into our vibe map automatically; you approve the tags.' },
  { title: 'We match, not blast', body: 'Your products only reach people whose learned vibe fits. A retro kit shop reaches Blokecore guys, not everyone.' },
  { title: 'Pay for results', body: 'Organic listing is free. Partner placement is pay-per-click-out or a cut of the sale. No impressions you did not ask for.' },
]

const RULES = [
  'Partner posts are always labelled Partner.',
  `A partner item only shows when it scores at least ${Math.round(PARTNER_MIN_RELEVANCE * 100)}/100 on the viewer's vibe match.`,
  'At most one partner slot in every ten posts.',
  'Brands see aggregated vibes, never individual people.',
  '"Not for me" on a partner post counts against its match score.',
]

export function Brands() {
  const max = Math.max(...SAMPLE.vibes.map((v) => v.share))
  return (
    <div className="flex flex-col gap-10 pt-6">
      <Link to="/me" className="flex items-center gap-1 text-[14px] text-ink-2 hover:text-ink">
        <ArrowLeft size={16} /> Back
      </Link>
      <header>
        <div className="eyebrow">For brands</div>
        <h1 className="display mt-2 text-[56px] sm:text-[68px]">Get found by the guys who'd actually buy it.</h1>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">
          NicheNotes is where people come to find what TikTok hasn't flattened yet. If you make something small, specific and good, this is your shelf.
        </p>
      </header>

      <section>
        <SectionTitle eyebrow="How it works" title="Three steps" />
        <ol className="mt-4 flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-[14px] border border-line bg-surface p-4">
              <span className="display text-[34px] text-accent">{i + 1}</span>
              <div>
                <div className="text-[16px] font-semibold">{s.title}</div>
                <p className="mt-0.5 text-[14px] text-ink-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionTitle eyebrow="Sample dashboard" title={SAMPLE.shop} action={<span className="font-mono text-[11px] text-ink-3">{SAMPLE.period}</span>} />
        <p className="mt-1 text-[13px] text-ink-3">Illustrative figures for a sample partner.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {SAMPLE.tiles.map((t) => (
            <div key={t.label} className="rounded-[14px] border border-line bg-surface p-4">
              <div className="text-[13px] text-ink-2">{t.label}</div>
              <div className="mt-1 text-[30px] leading-none font-semibold">{t.value}</div>
              <div className="mt-2 text-[12px] text-ink-3">{t.delta}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-[14px] border border-line bg-surface p-4">
          <div className="text-[14px] font-semibold">Who clicked through, by vibe</div>
          <div className="mt-3 flex flex-col gap-2.5">
            {SAMPLE.vibes.map((v) => (
              <div key={v.label} className="grid grid-cols-[104px_1fr_40px] items-center gap-3" title={`${v.label}: ${Math.round(v.share * 100)}% of click-outs`}>
                <span className="truncate text-[13px]">{v.label}</span>
                <span className="h-2.5 rounded-full bg-accent-soft">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(v.share / max) * 100}%` }} />
                </span>
                <span className="tnum text-right text-[13px] text-ink-2">{Math.round(v.share * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="The deal with our users" title="Rules we don't break" />
        <ul className="mt-4 flex flex-col gap-2.5">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2.5 text-[15px]">
              <Check size={18} className="mt-0.5 shrink-0 text-accent" /> {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] text-ink-2">Trust is the product. If the feed starts feeling like ads, nobody comes back, and then nobody buys.</p>
      </section>

      <section className="slab px-6 py-7">
        <div className="relative z-[1]">
          <div className="font-serif text-[28px] leading-tight italic">Founding partner spots are open.</div>
          <p className="mt-2 text-[14px] text-slab-ink-2">First 100 brands get free partner placement for three months and a say in how the program works.</p>
          <p className="mt-4 font-mono text-[12px] text-slab-ink-2">Prototype: no sign-up is wired up yet.</p>
        </div>
      </section>
    </div>
  )
}
