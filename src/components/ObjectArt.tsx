import { useId, type ReactNode } from 'react'
import type { ArtSpec, ShirtPattern } from '../data/types'

/**
 * Stand-in product imagery: each find is drawn as a simple object on the same
 * neutral background, like a studio product shot. Real partner photos replace
 * this once brands upload them.
 */
export function ObjectArt({ art, className = '' }: { art: ArtSpec; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const [bg, main, detail] = art.colors
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="200" style={{ fill: 'var(--tile)' }} />
      <g transform="translate(100 102) scale(0.84) translate(-100 -100)">
        <ellipse cx="100" cy="176" rx="58" ry="5" fill="#000" opacity="0.07" />
        {draw(art, main, detail, bg, uid)}
      </g>
    </svg>
  )
}

const SHIRT = 'M62 40 L86 30 Q100 42 114 30 L138 40 L170 66 L152 90 L140 82 L140 172 L60 172 L60 82 L48 90 L30 66 Z'
const JACKET = 'M62 38 L86 30 L100 44 L114 30 L138 38 L166 70 L174 162 L154 164 L146 94 L144 172 L56 172 L54 94 L46 164 L26 162 L34 70 Z'

function pattern(kind: ShirtPattern | undefined, detail: string): ReactNode {
  switch (kind) {
    case 'bands':
      return [50, 90, 130].map((y) => <rect key={y} x="0" y={y} width="200" height="20" fill={detail} />)
    case 'stripes':
      return [52, 76, 100, 124, 148].map((x) => <rect key={x} x={x} y="0" width="12" height="200" fill={detail} />)
    case 'pinstripe':
      return Array.from({ length: 14 }, (_, i) => <rect key={i} x={36 + i * 10} y="0" width="1.6" height="200" fill={detail} />)
    case 'sash':
      return <polygon points="64,34 92,30 150,172 118,172" fill={detail} />
    case 'halves':
      return <rect x="100" y="0" width="100" height="200" fill={detail} />
    case 'chevron':
      return [60, 92, 124, 156].map((y) => (
        <polyline key={y} points={`20,${y} 60,${y - 16} 100,${y} 140,${y - 16} 180,${y}`} fill="none" stroke={detail} strokeWidth="9" />
      ))
    default:
      return null
  }
}

function label(text: string | undefined, x: number, y: number, color: string, size = 11): ReactNode {
  if (!text) return null
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize={size} fontWeight="500" fill={color} letterSpacing="0.5">
      {text}
    </text>
  )
}

function draw(art: ArtSpec, main: string, detail: string, bg: string, uid: string): ReactNode {
  switch (art.kind) {
    case 'shirt': {
      const clip = `shirt-${uid}`
      return (
        <g>
          <clipPath id={clip}>
            <path d={SHIRT} />
          </clipPath>
          <path d={SHIRT} fill={main} />
          <g clipPath={`url(#${clip})`}>{pattern(art.pattern, detail)}</g>
          <path d={SHIRT} fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1.5" />
          <path d="M86 30 Q100 50 114 30" fill="none" stroke={art.pattern === 'plain' ? '#000' : detail} strokeOpacity={art.pattern === 'plain' ? 0.25 : 1} strokeWidth="5" />
          {art.mark && (
            <text x="100" y="128" textAnchor="middle" fontFamily="'Big Shoulders Display', Impact, sans-serif" fontWeight="900" fontSize="46" fill={bg} stroke={main} strokeWidth="1.5" paintOrder="stroke">
              {art.mark}
            </text>
          )}
        </g>
      )
    }
    case 'jacket': {
      const clip = `jacket-${uid}`
      return (
        <g>
          <clipPath id={clip}>
            <path d={JACKET} />
          </clipPath>
          <path d={JACKET} fill={main} />
          <g clipPath={`url(#${clip})`}>{pattern(art.pattern, detail)}</g>
          <path d={JACKET} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.5" />
          <line x1="100" y1="44" x2="100" y2="172" stroke={art.pattern === 'halves' ? main : detail} strokeWidth="2.5" />
          <path d="M86 30 L100 50 L114 30" fill="none" stroke={detail} strokeWidth="4" />
          <rect x="66" y="112" width="22" height="16" rx="2" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" />
          <rect x="112" y="112" width="22" height="16" rx="2" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" />
        </g>
      )
    }
    case 'scarf':
      return (
        <g transform="rotate(-18 100 100)">
          <rect x="30" y="84" width="140" height="34" fill={main} />
          {[52, 88, 124].map((x) => (
            <rect key={x} x={x} y="84" width="12" height="34" fill={detail} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <line x1="30" y1={87 + i * 4.8} x2="18" y2={87 + i * 4.8} stroke={main} strokeWidth="2" />
              <line x1="170" y1={87 + i * 4.8} x2="182" y2={87 + i * 4.8} stroke={main} strokeWidth="2" />
            </g>
          ))}
        </g>
      )
    case 'sneaker':
      return (
        <g>
          <path d="M28 136 Q30 104 58 100 L92 94 Q108 76 126 94 L162 110 Q178 116 176 136 Z" fill={main} />
          <path d="M26 134 L178 134 L176 146 Q100 152 28 146 Z" fill={detail} />
          <path d="M96 96 L110 118 M104 92 L120 114 M114 90 L130 110" stroke={bg} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 128 Q100 108 150 124" fill="none" stroke={bg} strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <path d="M72 82 Q100 30 128 82" fill="none" stroke={detail} strokeWidth="6" />
          <rect x="52" y="78" width="96" height="92" rx="12" fill={main} />
          <path d="M52 92 Q100 118 148 92 L148 90 Q148 78 136 78 L64 78 Q52 78 52 90 Z" fill="#000" opacity="0.14" />
          <rect x="92" y="98" width="16" height="10" rx="2" fill={detail} />
        </g>
      )
    case 'chain': {
      const links = Array.from({ length: 17 }, (_, i) => {
        const t = Math.PI * (0.08 + (0.84 * i) / 16)
        const x = 100 - Math.cos(t) * 62
        const y = 48 + Math.sin(t) * 100
        return <ellipse key={i} cx={x} cy={y} rx={i % 2 ? 7 : 4.5} ry={i % 2 ? 4.5 : 7} fill="none" stroke={main} strokeWidth="3.5" />
      })
      return (
        <g>
          {links}
          <circle cx="100" cy="150" r="6" fill={detail} />
        </g>
      )
    }
    case 'ring':
      if (art.mark) {
        return (
          <g>
            <circle cx="100" cy="100" r="54" fill={main} />
            <circle cx="100" cy="100" r="44" fill="none" stroke={detail} strokeWidth="2" />
            <text x="100" y="112" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight="600" fontSize="34" fill={detail}>
              {art.mark}
            </text>
          </g>
        )
      }
      return (
        <g>
          <circle cx="100" cy="116" r="40" fill="none" stroke={main} strokeWidth="13" />
          <rect x="72" y="58" width="56" height="30" rx="12" fill={main} />
          <rect x="80" y="64" width="40" height="18" rx="8" fill="none" stroke={detail} strokeWidth="2" />
        </g>
      )
    case 'watch':
      return (
        <g>
          <rect x="82" y="14" width="36" height="172" rx="6" fill={main} />
          {[34, 46, 154, 166].map((y) => (
            <line key={y} x1="82" y1={y} x2="118" y2={y} stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
          ))}
          <circle cx="100" cy="100" r="44" fill="#1b1b1b" opacity="0.18" />
          <circle cx="100" cy="100" r="41" fill={detail} stroke="#2a2a2a" strokeWidth="6" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6
            return <line key={i} x1={100 + Math.sin(a) * 30} y1={100 - Math.cos(a) * 30} x2={100 + Math.sin(a) * 35} y2={100 - Math.cos(a) * 35} stroke="#1b1b1b" strokeWidth={i % 3 ? 1.5 : 3} />
          })}
          <line x1="100" y1="100" x2="100" y2="74" stroke="#1b1b1b" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="100" y1="100" x2="120" y2="110" stroke="#1b1b1b" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="140" y="95" width="7" height="10" rx="2" fill="#2a2a2a" />
        </g>
      )
    case 'cap':
      return (
        <g>
          <path d="M50 124 Q50 62 100 60 Q150 62 150 124 Z" fill={main} />
          <path d="M100 60 L100 124 M76 66 Q70 94 72 124 M124 66 Q130 94 128 124" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.5" />
          <path d="M40 122 Q100 112 178 128 Q176 140 152 138 Q100 130 48 132 Z" fill={detail} />
          <circle cx="100" cy="60" r="4" fill={detail} />
        </g>
      )
    case 'glasses':
      return (
        <g fill="none" stroke={main} strokeWidth="7">
          <rect x="34" y="80" width="56" height="44" rx="18" fill={detail} fillOpacity="0.15" />
          <rect x="110" y="80" width="56" height="44" rx="18" fill={detail} fillOpacity="0.15" />
          <path d="M90 94 Q100 84 110 94" />
          <path d="M34 90 L18 84 M166 90 L182 84" strokeLinecap="round" />
        </g>
      )
    case 'bottle':
      return (
        <g>
          <rect x="70" y="78" width="60" height="96" rx="12" fill={main} />
          <rect x="88" y="62" width="24" height="18" fill={main} />
          <rect x="84" y="36" width="32" height="30" rx="6" fill={detail} />
          <rect x="76" y="108" width="48" height="36" rx="3" fill={bg} opacity="0.92" />
          {label(art.mark, 100, 131, main)}
        </g>
      )
    case 'tube':
      return (
        <g>
          <rect x="80" y="30" width="40" height="144" rx="18" fill={main} stroke="#000" strokeOpacity="0.1" />
          <rect x="80" y="30" width="40" height="42" rx="18" fill={detail} />
          {label(art.mark, 100, 122, detail, 10)}
        </g>
      )
    case 'jar':
      return (
        <g>
          <rect x="54" y="96" width="92" height="76" rx="12" fill={main} />
          <rect x="50" y="76" width="100" height="26" rx="7" fill={detail} />
          <rect x="66" y="116" width="68" height="34" rx="3" fill={bg} opacity="0.92" />
          {label(art.mark, 100, 138, main)}
        </g>
      )
    case 'book':
      return (
        <g>
          <rect x="66" y="36" width="82" height="132" rx="3" fill="#f3efe4" />
          <rect x="58" y="32" width="84" height="134" rx="3" fill={main} />
          <rect x="58" y="32" width="10" height="134" fill="#000" opacity="0.2" />
          <line x1="80" y1="70" x2="130" y2="70" stroke={detail} strokeWidth="1.5" />
          <line x1="80" y1="96" x2="130" y2="96" stroke={detail} strokeWidth="1.5" />
          {label(art.mark, 105, 87, detail, art.mark && art.mark.length > 8 ? 7.5 : 10)}
        </g>
      )
    case 'record':
      return (
        <g>
          <circle cx="124" cy="100" r="54" fill={main} />
          {[46, 38, 30].map((r) => (
            <circle key={r} cx="124" cy="100" r={r} fill="none" stroke="#fff" strokeOpacity="0.08" />
          ))}
          <circle cx="124" cy="100" r="16" fill={detail} />
          <rect x="36" y="44" width="112" height="112" rx="2" fill={detail} />
          <rect x="48" y="56" width="88" height="88" fill="none" stroke={main} strokeWidth="2" />
          <circle cx="92" cy="100" r="22" fill={main} />
        </g>
      )
    case 'mug':
      return (
        <g>
          <path d="M130 100 Q156 100 156 122 Q156 142 130 142" fill="none" stroke={main} strokeWidth="8" />
          <rect x="62" y="84" width="72" height="84" rx="8" fill={main} />
          <path d="M84 70 Q78 58 86 48 M100 70 Q94 56 102 44 M116 70 Q110 58 118 48" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    case 'shorts':
      return (
        <g>
          <path d="M54 62 L146 62 L158 150 L110 156 L100 104 L90 156 L42 150 Z" fill={main} />
          <rect x="54" y="62" width="92" height="14" fill={detail} />
          <path d="M52 132 L62 150 M148 132 L138 150" stroke={detail} strokeWidth="3" />
        </g>
      )
    case 'pan':
      return (
        <g>
          <rect x="138" y="90" width="56" height="14" rx="6" fill={main} transform="rotate(-8 138 97)" />
          <circle cx="92" cy="104" r="56" fill={main} />
          <circle cx="92" cy="104" r="44" fill={detail} opacity="0.35" />
        </g>
      )
    case 'belt':
      return (
        <g>
          <rect x="18" y="86" width="164" height="30" rx="4" fill={main} />
          <line x1="18" y1="90" x2="182" y2="90" stroke={detail} strokeWidth="1" strokeDasharray="3 3" />
          <line x1="18" y1="112" x2="182" y2="112" stroke={detail} strokeWidth="1" strokeDasharray="3 3" />
          {[120, 136, 152, 168].map((x) => (
            <circle key={x} cx={x} cy="101" r="3" fill={bg} />
          ))}
          <rect x="40" y="78" width="30" height="46" rx="4" fill="none" stroke={detail} strokeWidth="6" />
          <line x1="55" y1="80" x2="55" y2="122" stroke={detail} strokeWidth="4" />
        </g>
      )
    case 'ball':
      return <Ball art={art} main={main} detail={detail} />
    case 'racket':
      return (
        <g>
          <rect x="93" y="118" width="14" height="58" rx="5" fill={detail} />
          <ellipse cx="100" cy="74" rx="40" ry="50" fill="none" stroke={main} strokeWidth="9" />
          <g stroke={detail} strokeOpacity="0.45" strokeWidth="1.5">
            {[-24, -12, 0, 12, 24].map((d) => (
              <line key={`v${d}`} x1={100 + d} y1={74 - Math.sqrt(1 - (d / 40) ** 2) * 46} x2={100 + d} y2={74 + Math.sqrt(1 - (d / 40) ** 2) * 46} />
            ))}
            {[-30, -15, 0, 15, 30].map((d) => (
              <line key={`h${d}`} x1={100 - Math.sqrt(1 - (d / 50) ** 2) * 36} y1={74 + d} x2={100 + Math.sqrt(1 - (d / 50) ** 2) * 36} y2={74 + d} />
            ))}
          </g>
        </g>
      )
    case 'mat':
      return (
        <g>
          <rect x="34" y="82" width="120" height="52" rx="8" fill={main} />
          <circle cx="152" cy="108" r="28" fill={main} />
          <circle cx="152" cy="108" r="20" fill="none" stroke={detail} strokeWidth="3" />
          <circle cx="152" cy="108" r="11" fill="none" stroke={detail} strokeWidth="3" />
          <rect x="70" y="82" width="10" height="52" fill={detail} opacity="0.6" />
        </g>
      )
    case 'block':
      return (
        <g>
          <path d="M52 92 L80 70 L152 70 L124 92 Z" fill={detail} />
          <path d="M124 92 L152 70 L152 132 L124 156 Z" fill={main} opacity="0.8" />
          <rect x="52" y="92" width="72" height="64" fill={main} />
          {art.mark && label(art.mark, 88, 129, detail, 10)}
        </g>
      )
    case 'speaker':
      return (
        <g>
          <rect x="62" y="48" width="76" height="118" rx="18" fill={main} />
          <circle cx="100" cy="126" r="24" fill={detail} />
          <circle cx="100" cy="126" r="9" fill={main} />
          <circle cx="100" cy="80" r="10" fill={detail} />
        </g>
      )
    case 'skateboard':
      return (
        <g>
          <rect x="24" y="90" width="152" height="24" rx="12" fill={main} />
          <path d="M40 90 Q100 100 160 90" fill="none" stroke={detail} strokeWidth="3" />
          <rect x="44" y="114" width="24" height="7" rx="2" fill="#6b6b6b" />
          <rect x="132" y="114" width="24" height="7" rx="2" fill="#6b6b6b" />
          {[48, 64, 136, 152].map((x) => (
            <circle key={x} cx={x} cy="128" r="8" fill={detail} />
          ))}
        </g>
      )
    case 'comb':
      return (
        <g>
          <rect x="40" y="76" width="120" height="24" rx="8" fill={main} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={46 + i * 8.8} y="98" width="5" height={i < 5 ? 40 : 34} rx="2" fill={main} />
          ))}
        </g>
      )
    case 'cushion':
      return (
        <g>
          <ellipse cx="100" cy="116" rx="70" ry="36" fill={main} />
          <ellipse cx="100" cy="104" rx="62" ry="26" fill={detail} opacity="0.55" />
          <circle cx="100" cy="104" r="5" fill={main} />
        </g>
      )
    case 'wallet':
      return (
        <g>
          <rect x="52" y="66" width="96" height="70" rx="10" fill={main} />
          <rect x="60" y="74" width="80" height="54" rx="6" fill="none" stroke={detail} strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M52 94 L148 94" stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
        </g>
      )
    case 'palette':
      return (
        <g>
          <rect x="42" y="66" width="116" height="74" rx="10" fill={main} stroke="#000" strokeOpacity="0.12" />
          {['#d64545', '#e8a13a', '#e8d54a', '#4aa05a', '#3a7bd5', '#7a4ab8'].map((c, i) => (
            <rect key={c} x={52 + (i % 3) * 34} y={76 + Math.floor(i / 3) * 30} width="28" height="22" rx="5" fill={c} />
          ))}
          <line x1="60" y1="160" x2="150" y2="146" stroke={detail} strokeWidth="5" strokeLinecap="round" />
        </g>
      )
    case 'camera':
      return (
        <g>
          <rect x="62" y="58" width="34" height="16" rx="3" fill={main} />
          <rect x="40" y="70" width="120" height="78" rx="12" fill={main} />
          <rect x="40" y="86" width="120" height="44" fill={detail} opacity="0.35" />
          <circle cx="100" cy="109" r="28" fill="#1b1b1b" />
          <circle cx="100" cy="109" r="18" fill={detail} />
          <circle cx="94" cy="103" r="5" fill="#fff" opacity="0.6" />
          <rect x="136" y="78" width="14" height="8" rx="2" fill={detail} />
        </g>
      )
    case 'keyboard':
      return (
        <g>
          <rect x="26" y="78" width="148" height="60" rx="10" fill={main} stroke="#000" strokeOpacity="0.12" />
          {Array.from({ length: 3 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => (
              <rect key={`${r}-${c}`} x={34 + c * 15.4} y={86 + r * 15} width="12" height="11" rx="2.5" fill={r === 2 && c > 2 && c < 6 ? detail : '#000'} opacity={r === 2 && c > 2 && c < 6 ? 1 : 0.14} />
            )),
          )}
        </g>
      )
    case 'headphones':
      return (
        <g>
          <path d="M54 112 Q54 48 100 48 Q146 48 146 112" fill="none" stroke={main} strokeWidth="10" strokeLinecap="round" />
          <rect x="38" y="100" width="30" height="52" rx="12" fill={main} />
          <rect x="132" y="100" width="30" height="52" rx="12" fill={main} />
          <rect x="60" y="106" width="10" height="40" rx="4" fill={detail} />
          <rect x="130" y="106" width="10" height="40" rx="4" fill={detail} />
        </g>
      )
    case 'gamepad':
      return (
        <g>
          <path d="M58 76 L142 76 Q172 76 176 118 Q180 152 158 152 Q146 152 136 132 L64 132 Q54 152 42 152 Q20 152 24 118 Q28 76 58 76 Z" fill={main} />
          <rect x="52" y="96" width="8" height="26" rx="2" fill="#1b1b1b" />
          <rect x="43" y="105" width="26" height="8" rx="2" fill="#1b1b1b" />
          {[
            [140, 100],
            [152, 110],
            [128, 110],
            [140, 120],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={detail} />
          ))}
        </g>
      )
    case 'dice':
      return (
        <g>
          <g transform="rotate(-12 78 112)">
            <rect x="48" y="82" width="60" height="60" rx="12" fill={main} />
            {[
              [64, 98],
              [92, 126],
              [78, 112],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={detail} />
            ))}
          </g>
          <g transform="rotate(14 132 98)">
            <rect x="104" y="70" width="56" height="56" rx="12" fill={main} />
            {[
              [118, 84],
              [146, 84],
              [118, 112],
              [146, 112],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={detail} />
            ))}
          </g>
        </g>
      )
    case 'frame':
      return (
        <g>
          <rect x="48" y="36" width="104" height="132" rx="3" fill={main} />
          <rect x="58" y="46" width="84" height="112" fill="#f7f4ec" />
          <circle cx="122" cy="72" r="10" fill={detail} />
          <path d="M58 158 L58 128 L84 100 L104 122 L118 108 L142 134 L142 158 Z" fill={main} opacity="0.75" />
        </g>
      )
    case 'vase':
      return (
        <g>
          <path d="M84 48 L116 48 L113 70 Q150 96 136 148 Q130 172 100 172 Q70 172 64 148 Q50 96 87 70 Z" fill={main} />
          <path d="M60 124 Q100 134 140 124" fill="none" stroke={detail} strokeWidth="5" />
          <ellipse cx="100" cy="48" rx="16" ry="4" fill={detail} />
        </g>
      )
    case 'plant':
      return (
        <g>
          {[
            [100, 70, 0],
            [74, 84, -40],
            [126, 84, 40],
            [84, 58, -18],
            [116, 58, 18],
            [62, 104, -65],
            [138, 104, 65],
          ].map(([x, y, r]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="12" ry="26" fill={detail} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <path d="M66 116 L134 116 L126 172 L74 172 Z" fill={main} />
          <rect x="62" y="110" width="76" height="12" rx="3" fill={main} />
        </g>
      )
    case 'candle':
      return (
        <g>
          <path d="M100 52 Q112 70 100 84 Q88 70 100 52 Z" fill={detail} />
          <line x1="100" y1="84" x2="100" y2="94" stroke="#2b2b2b" strokeWidth="2" />
          <rect x="68" y="94" width="64" height="78" rx="8" fill={main} />
          <ellipse cx="100" cy="96" rx="30" ry="5" fill="#000" opacity="0.08" />
        </g>
      )
    case 'lamp':
      return (
        <g>
          <ellipse cx="72" cy="170" rx="34" ry="6" fill={main} />
          <path d="M72 168 L72 110 L126 72" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M110 58 L152 70 L140 102 L98 86 Z" fill={main} />
          <path d="M98 86 L140 102 L150 170 L70 170 Z" fill={detail} opacity="0.18" />
        </g>
      )
    case 'lantern':
      return (
        <g>
          <path d="M80 56 Q100 30 120 56" fill="none" stroke={main} strokeWidth="5" />
          <rect x="72" y="56" width="56" height="16" rx="4" fill={main} />
          <rect x="76" y="72" width="48" height="76" rx="6" fill={detail} opacity="0.85" />
          <path d="M100 92 Q110 108 100 122 Q90 108 100 92 Z" fill="#fff" opacity="0.8" />
          <rect x="68" y="148" width="64" height="18" rx="5" fill={main} />
        </g>
      )
    case 'bowl':
      return (
        <g>
          <path d="M34 100 L166 100 Q162 164 100 168 Q38 164 34 100 Z" fill={main} />
          {[112, 126, 140, 154].map((y) => (
            <path key={y} d={`M${40 + (y - 100) * 0.5} ${y} Q100 ${y + 10} ${160 - (y - 100) * 0.5} ${y}`} fill="none" stroke={detail} strokeWidth="2.5" />
          ))}
          <ellipse cx="100" cy="100" rx="66" ry="10" fill={detail} />
        </g>
      )
  }
}

function Ball({ art, main, detail }: { art: ArtSpec; main: string; detail: string }) {
  switch (art.variant) {
    case 'football':
      return (
        <g transform="rotate(-24 100 104)">
          <ellipse cx="100" cy="104" rx="72" ry="42" fill={main} />
          <line x1="76" y1="104" x2="124" y2="104" stroke={detail} strokeWidth="4" strokeLinecap="round" />
          {[82, 92, 102, 112, 122].map((x) => (
            <line key={x} x1={x} y1="97" x2={x} y2="111" stroke={detail} strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
      )
    case 'golf':
      return (
        <g>
          <path d="M92 142 L108 142 L102 176 L98 176 Z" fill={detail} />
          <circle cx="100" cy="104" r="40" fill={main} stroke="#000" strokeOpacity="0.1" />
          {Array.from({ length: 14 }, (_, i) => {
            const a = i * 2.4
            const r = 8 + (i % 4) * 7
            return <circle key={i} cx={100 + Math.cos(a) * r} cy={104 + Math.sin(a) * r} r="3" fill="#000" opacity="0.08" />
          })}
        </g>
      )
    case 'tennis':
      return (
        <g>
          <circle cx="100" cy="104" r="50" fill={main} />
          <path d="M62 72 Q100 104 62 136" fill="none" stroke={detail} strokeWidth="5" />
          <path d="M138 72 Q100 104 138 136" fill="none" stroke={detail} strokeWidth="5" />
        </g>
      )
    case 'yarn':
      return (
        <g>
          <circle cx="100" cy="104" r="52" fill={main} />
          {[-30, -15, 0, 15, 30].map((d) => (
            <path key={d} d={`M${60 + d * 0.3} ${70 + d} Q100 ${104 + d * 0.6} ${140 - d * 0.3} ${70 - d * 0.2}`} fill="none" stroke={detail} strokeWidth="3" />
          ))}
          <path d="M146 130 Q170 150 160 172" fill="none" stroke={main} strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    default:
      // Basketball
      return (
        <g>
          <circle cx="100" cy="104" r="56" fill={main} />
          <g fill="none" stroke={detail} strokeWidth="3.5">
            <line x1="100" y1="48" x2="100" y2="160" />
            <line x1="44" y1="104" x2="156" y2="104" />
            <path d="M62 64 Q84 104 62 144" />
            <path d="M138 64 Q116 104 138 144" />
          </g>
        </g>
      )
  }
}
