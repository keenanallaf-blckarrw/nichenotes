import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { PARTNER_MIN_RELEVANCE } from '../engine'
import { PageTitle, SectionHeader } from '../components/bits'

// Illustrative numbers for a sample partner, to show what a brand would see.
const SAMPLE = {
  shop: 'A retro jersey shop',
  period: 'Last 30 days',
  tiles: [
    { label: 'People reached', value: '48.2K', note: 'Up 18% from the 30 days before' },
    { label: 'Visits to your store', value: '3,914', note: 'Up 24% from the 30 days before' },
    { label: 'Visit rate', value: '8.1%', note: 'Average on NicheNotes: 2.3%' },
    { label: 'Sales from NicheNotes', value: '$11.6K', note: '171 orders' },
  ],
  interests: [
    { label: 'Retro Jerseys', share: 0.46 },
    { label: 'Soccer', share: 0.27 },
    { label: 'Vintage', share: 0.14 },
    { label: 'Stadium Travel', share: 0.08 },
    { label: 'Streetwear', share: 0.05 },
  ],
}

const STEPS = [
  { title: 'Add your products', body: 'Connect your store. We sort each product into the right interests, and you approve it.' },
  { title: 'Reach the right people', body: 'Your products only appear for people whose taste matches. A jersey shop reaches soccer fans who love vintage, not everyone.' },
  { title: 'Pay for results', body: 'Listing is free. Partner placement is paid per store visit or as a share of each sale.' },
]

const RULES = [
  'Partner posts are always labeled.',
  `A partner post only appears when it scores at least ${Math.round(PARTNER_MIN_RELEVANCE * 100)} out of 100 on how well it matches the person.`,
  'No more than one partner post in every ten.',
  'Brands see totals by interest, never individual people.',
  'When someone taps "Not interested" on a partner post, its match score goes down.',
]

export function Brands() {
  const max = Math.max(...SAMPLE.interests.map((v) => v.share))
  return (
    <div>
      <Link to="/me" className="t-sub -ml-1 flex items-center pt-5 text-accent-text">
        <ChevronLeft size={22} /> You
      </Link>
      <PageTitle title="For brands" />
      <p className="t-title2 mt-2 font-normal text-ink-2">Reach the people who actually want what you make.</p>

      <section className="mt-12">
        <SectionHeader title="How it works" />
        <ol className="mt-4 flex flex-col gap-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="t-headline flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink-2">{i + 1}</span>
              <span>
                <span className="t-headline block">{s.title}</span>
                <span className="t-sub block text-ink-2">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <SectionHeader title="What you'd see" />
        <p className="t-foot mt-1 text-ink-2">
          {SAMPLE.shop}, {SAMPLE.period.toLowerCase()}. Sample numbers.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {SAMPLE.tiles.map((t) => (
            <div key={t.label} className="rounded-[16px] bg-surface p-4">
              <p className="t-foot text-ink-2">{t.label}</p>
              <p className="mt-1 text-[1.75rem] leading-none font-semibold tracking-[-0.02em]">{t.value}</p>
              <p className="t-foot mt-2 text-ink-3">{t.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-[16px] bg-surface p-4">
          <p className="t-headline">Store visits by interest</p>
          <div className="mt-4 flex flex-col gap-3">
            {SAMPLE.interests.map((v) => (
              <div key={v.label} className="grid grid-cols-[112px_1fr_40px] items-center gap-3" title={`${v.label}: ${Math.round(v.share * 100)}% of store visits`}>
                <span className="t-foot truncate">{v.label}</span>
                <span className="h-1.5 rounded-full bg-accent-soft">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(v.share / max) * 100}%` }} />
                </span>
                <span className="t-foot tnum text-right text-ink-2">{Math.round(v.share * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="Our promise to users" />
        <ul className="mt-3 overflow-hidden rounded-[14px] bg-surface">
          {RULES.map((r) => (
            <li key={r} className="t-sub border-b-[0.5px] border-line px-4 py-3 last:border-b-0">
              {r}
            </li>
          ))}
        </ul>
        <p className="t-sub mt-4 text-ink-2">Trust is the product. If the feed starts to feel like ads, people leave, and then nobody buys.</p>
      </section>

      <section className="mt-12 rounded-[20px] bg-surface px-5 py-6 text-center">
        <h2 className="t-title2">Founding partners</h2>
        <p className="t-sub mx-auto mt-1 max-w-[34ch] text-ink-2">The first 100 brands get free partner placement for three months.</p>
        <p className="t-foot mt-3 text-ink-3">Preview version: sign-up isn't open yet.</p>
      </section>
    </div>
  )
}
