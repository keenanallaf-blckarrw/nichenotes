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
  }
}
